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
    res.json("Product uploaded");
  });
};

exports.show = (req, res) => {
  let showProducts = "SELECT * from products";
  sql.query(showProducts, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
};
