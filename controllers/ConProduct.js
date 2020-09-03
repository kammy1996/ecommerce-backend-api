//importing SQL Configuration
import sqlConfig from "../database/dbConfig";
let sql = sqlConfig.mysql_pool;
import fs from "fs";

// Main submission of the form
exports.add = (req, res) => {
  const {
    name,
    shortDescription,
    specification,
    price,
    discount,
    finalPrice,
  } = req.body;

  let addQuery =
    "INSERT INTO products(name,short_description,specification,price,discount,final_price) VALUES('" +
    name +
    "','" +
    shortDescription +
    "','" +
    specification +
    "','" +
    price +
    "','" +
    discount +
    "','" +
    finalPrice +
    "');";

  sql.query(addQuery, (err, result) => {
    if (err) throw err;
  });

  //Updating product_id to actual product_id from products
  let updateId = `UPDATE product_stock SET product_id = (SELECT id FROM products WHERE name='${name}') WHERE product_id = '1'`;
  sql.query(updateId, (err, result) => {
    if (err) throw err;
  });

  //Mapping categories_id and product_id into product_categories
  let selectedCat = req.body.selectedCat;
  let mapProduct = `INSERT INTO product_categories(product_id,category_id) SELECT id,'${selectedCat}' FROM products WHERE name = '${name}'`;
  sql.query(mapProduct, (err, result) => {
    if (err) throw err;
    console.log(`Product Uploaded Sucessfully`);
  });
};

//Fetching all the products
exports.show = (req, res) => {
  let showProducts =
    "SELECT products.id,products.name,products.short_description,products.specification,products.price,products.discount,products.final_price,products.discount,product_images.file_name,product_stock.color,product_categories.category_id from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN product_categories ON products.id = product_categories.product_id GROUP BY products.name";
  sql.query(showProducts, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

//Add Category
exports.catAdd = (req, res) => {
  const nameCat = req.body.catName;
  let addCat = "INSERT into categories(name)VALUES('" + nameCat + "')";
  sql.query(addCat, (err, result) => {
    if (err) throw err;
    res.json({
      message: "Category Added Successfully",
    });
  });
};

//get Category
exports.catShow = (req, res) => {
  sql.query("SELECT * FROM categories", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.imageAdd = (req, res) => {
  let pName = req.body.nameForImage; // Creating folder names as per product name
  let imageName = req.files; // Getting all the image files
  let fileNames = []; // Array to add into Database

  // Creating new Directory as per Product name
  let dir = `./public/uploads/products/${pName}`;
  fs.existsSync(dir) || fs.mkdirSync(dir);

  for (var i = 0; i < imageName.length; i++) {
    let name = imageName[i].filename;

    //Rename the Path from temp to actual flies
    fs.rename(
      `./public/uploads/tmp/${name}`,
      `./public/uploads/products/${pName}/${name}`,
      function (err) {
        if (err) return console.error(err);
      }
    );

    fileNames.push([name]);
  }

  res.json("images uploaded Successfuly");

  let addImages = `INSERT INTO product_images(file_name) VALUES ?`;
  sql.query(addImages, [fileNames], (err, result) => {
    if (err) throw err;
  });
};

exports.showImages = (req, res) => {
  sql.query(`SELECT file_name from product_images`, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.stockAdd = (req, res) => {
  let stock = req.body.stock;
  // Inserting color and quantity and temp product_id = 1
  let colorAdd = `INSERT INTO product_stock(color,quantity)VALUES ?`;
  sql.query(colorAdd, [stock], (err, result) => {
    if (err) throw err;
  });

  // updating Stock_id in product_images
  let stockId = `UPDATE product_images SET stock_id = (SELECT id FROM product_stock WHERE color ='${stock[0][0]}' AND quantity = '${stock[0][1]}') WHERE stock_id = '1'`;
  setTimeout(() => {
    sql.query(stockId, (err, result) => {
      if (err) throw err;
    });
  }, 1000);
};

exports.showProductAsPerId = (req, res) => {
  sql.query(
    `SELECT * from products where id = ${req.params.id}`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
      console.log(result);
    }
  );
};
