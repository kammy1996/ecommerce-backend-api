//importing SQL Configuration
import sqlConfig from "../database/dbConfig";
let sql = sqlConfig.mysql_pool;

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
    console.log("product Uploaded");
    res.json({
      message: "product Uploaded Successfully",
    });
  });
};

exports.show = (req, res) => {
  let showProducts = "SELECT * FROM products";
  sql.query(showProducts, (err, result) => {
    if (err) throw err;
    console.log(result);
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

exports.addStock = (req, res) => {
  const { color, quantity } = req.body;
  let stockQuery =
    "INSERT INTO product_stock(color,quantity) VALUES('" +
    color +
    "','" +
    quantity +
    "');";

  sql.query(stockQuery, (err, result) => {
    if (err) throw err;
    res.json("stock Added Successfully");
  });
};
