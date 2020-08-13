//importing SQL Configuration
import sqlConfig from "../database/dbConfig";
let sql = sqlConfig.mysql_pool;

exports.add = (req, res) => {
  const { name, shortDescription, price, discount } = req.body;

  let addQuery =
    "INSERT INTO products(name,short_description,price,discount) VALUES('" +
    name +
    "','" +
    shortDescription +
    "','" +
    price +
    "','" +
    discount +
    "');";

  sql.query(addQuery, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("product uploaded");
  });
};

exports.get = (req, res) => {
  let showProducts = "SELECT * from products";
  sql.query(showProducts, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
};
