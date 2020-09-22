//importing SQL Configuration
import sqlConfig from "../../database/dbConfig";
let sql = sqlConfig.mysql_pool;
import fs from "fs";
import mysql from "mysql";
import path from "path";

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

  //Mapping categories_id and product_id into product_categories
  let selectedCat = req.body.selectedCat;
  let mapProduct = `INSERT INTO product_categories(product_id,category_id) SELECT id,'${selectedCat}' FROM products WHERE name = '${name}'`;
  sql.query(mapProduct, (err, result) => {
    if (err) throw err;
    res.json({
      message: "product Uploaded Successfully",
    });
  });

  //Updating product_id to actual product_id from products
  let updateId = `UPDATE product_stock SET product_id = (SELECT id FROM products WHERE name='${name}') WHERE product_id = '1'`;
  sql.query(updateId, (err, result) => {
    if (err) throw err;
  });
};

//Fetching all the products
exports.show = (req, res) => {
  let showProducts = "SELECT name from products";
  sql.query(showProducts, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

//Add Category
exports.catAdd = (req, res) => {
  const nameCat = req.body.catName;
  let addCat = `INSERT into categories(name)VALUES('${nameCat}')`;
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
  // Creating folder names as per product name
  let pName = req.body.nameForImage;

  let finalName = pName.toLowerCase();

  let imageName = req.files; // Getting all the image files
  let fileNames = []; // Array to add into Database

  // Creating new Directory as per Product name
  let dir = `./public/uploads/products/${finalName}`;
  fs.existsSync(dir) || fs.mkdirSync(dir);

  for (var i = 0; i < imageName.length; i++) {
    let name = imageName[i].filename;

    //Rename the Path from temp to actual flies
    fs.rename(
      `./public/uploads/tmp/${name}`,
      `./public/uploads/products/${finalName}/${name}`,
      function (err) {
        if (err) return console.error(err);
      }
    );

    fileNames.push([name]);
  }

  res.json("images uploaded Successfully");

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

exports.getProductById = (req, res) => {
  sql.query(
    `SELECT products.id,products.name,products.short_description,products.specification,products.price,products.discount,products.final_price,product_categories.category_id FROM products INNER JOIN product_categories ON product_categories.product_id = products.id WHERE products.id = ${req.params.id}`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
};

exports.getProductStock = (req, res) => {
  sql.query(
    `SELECT product_stock.id,product_stock.color,product_stock.quantity from product_stock INNER JOIN products ON product_stock.product_id = ${req.params.id} GROUP BY product_stock.color`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
};

exports.getProductImagesById = (req, res) => {
  sql.query(
    `SELECT product_images.id,product_images.file_name,product_images.stock_id FROM product_images INNER JOIN product_stock ON product_stock.id = product_images.stock_id INNER JOIN products ON  product_stock.product_id = ${req.params.id} GROUP BY product_images.file_name`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
};

exports.updateProduct = (req, res) => {
  const {
    shortDescription,
    specification,
    price,
    discount,
    finalPrice,
    stock,
    categoryId,
  } = req.body;

  let productUpdate = `UPDATE products SET short_description = '${shortDescription}', specification='${specification}',price ='${price}',discount='${discount}',final_price='${finalPrice}' WHERE id = ${req.params.id}`;
  sql.query(productUpdate, (err, result) => {
    if (err) throw err;
  });

  let stockQueries = "";
  stock.forEach((item) => {
    stockQueries += mysql.format(
      `UPDATE product_stock SET color = ?,quantity =? WHERE id = ?;`,
      item
    );
  });

  sql.query(stockQueries, (err, result) => {
    if (err) throw err;
  });

  sql.query(
    `UPDATE product_categories SET category_id =${categoryId} WHERE product_id = ${req.params.id}`,
    (err, result) => {
      if (err) throw err;
      res.json({
        message: `product Updated`,
      });
    }
  );
};

exports.updateNewImages = (req, res) => {
  let imageNames = req.files;
  let pName = req.body.name;

  let fileNames = [];

  imageNames.forEach((image) => {
    let name = image.filename;

    fs.rename(
      `./public/uploads/tmp/${name}`,
      `./public/uploads/products/${pName}/${name}`,
      function (err) {
        if (err) return console.error(err);
      }
    );

    fileNames.push([req.params.stockId, name]);
  });

  sql.query(
    `INSERT INTO product_images(stock_id,file_name)VALUES ?`,
    [fileNames],
    (err, result) => {
      if (err) throw err;
      console.log("images added");
      res.json({
        message: "image edited",
      });
    }
  );
};

exports.updateExistingImage = (req, res) => {
  let pName = req.body.pName;
  let Lname = pName.toLowerCase();
  let removedImages = req.body.removed;

  let removeMultipleQuery = "";
  removedImages.forEach((item) => {
    removeMultipleQuery += mysql.format(
      `DELETE FROM product_images WHERE file_name = ?;`,
      item
    );
  });
  sql.query(removeMultipleQuery, (err, result) => {
    if (err) throw err;
  });

  removedImages.forEach((remove) => {
    const removedDir = `./public/uploads/products/${Lname}/${remove}`;
    fs.unlink(removedDir, (err) => {
      if (err) throw err;
    });
  });
};

exports.updateNewStock = (req, res) => {
  const { color, quantity } = req.body;

  sql.query(
    `INSERT INTO product_stock(product_id,color,quantity) VALUES(${req.params.id},'${color}','${quantity}')`,
    (err, result) => {
      if (err) throw err;
      console.log(`new Stock Added`);
    }
  );
};

exports.deleteStock = (req, res) => {
  sql.query(
    `DELETE FROM product_stock where id = ${req.params.stockId}; DELETE FROM product_images WHERE stock_id = ${req.params.stockId}`,
    (err, result) => {
      if (err) throw err;
      console.log(`stock Deleted`);
    }
  );

  // Delete Images from product_images
  sql.query(
    `DELETE FROM product_images WHERE stock_id = ${req.params.stockId}`,
    (err, result) => {
      if (err) throw err;
      console.log(`Stock deleted From Database`);
    }
  );

  let name = req.body.name;
  let Lname = name.toLowerCase();

  sql.query(
    `SELECT file_name FROM product_images WHERE stock_id = ${req.params.stockId}`,
    (err, result) => {
      if (err) throw err;
      // let deletedStockFiles = [];
      result.forEach((file) => {
        // deletedStockFiles.push(file.file_name);
        const removedDir = `./public/uploads/products/${Lname}/${file.file_name}`;
        fs.unlink(removedDir, (err) => {
          if (err) throw err;
        });
      });
    }
  );
};

exports.getRelatedProducts = (req, res) => {
  let relatedQuery = `SELECT products.id,products.name,products.price,products.discount,products.final_price,product_images.file_name FROM products INNER JOIN product_categories ON product_categories.product_id = products.id INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images ON product_images.stock_id = product_stock.id WHERE product_categories.category_id = ${req.params.id} GROUP BY products.name`;

  sql.query(relatedQuery, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.productsAsPerPagination = (req, res) => {
  const limit = req.params.perPage;
  let page = req.params.page;
  const offset = (page - 1) * limit;

  let productsQuery = `SELECT products.id,products.name,products.price,products.discount,products.final_price,product_images.file_name from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN product_categories ON products.id = product_categories.product_id GROUP BY products.name LIMIT ${limit} OFFSET ${offset}  `;

  sql.query(productsQuery, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};
