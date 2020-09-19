//importing SQL Configuration
import sqlConfig from "../database/dbConfig";
let sql = sqlConfig.mysql_pool;

exports.priceFilter = (req, res) => {
  let priceQuery = `SELECT products.id,products.name,products.price,products.discount,products.final_price,product_images.file_name from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN product_categories ON products.id = product_categories.product_id WHERE products.final_price BETWEEN ${req.params.min} AND ${req.params.max} GROUP BY products.name`;

  sql.query(priceQuery, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
  //   let priceStart = req.
};

exports.sortProductsByPrice = (req, res) => {
  let order;
  let seq = req.params.sequence;
  if (seq == 0) {
    order = "DESC";
  } else {
    order = "";
  }
  let sortPrice = `SELECT products.id,products.name,products.price,products.discount,products.final_price,product_images.file_name from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN product_categories ON products.id = product_categories.product_id WHERE products.final_price  GROUP BY products.name ORDER BY products.final_price ${order}`;

  sql.query(sortPrice, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.searchProductByName = (req, res) => {
  let searchProduct = `SELECT id,name FROM products WHERE name LIKE '%${req.params.name}%'`;
  sql.query(searchProduct, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};
