//importing SQL Configuration
const sqlConfig = require("../../database/dbConfig")
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

// exports.addProductToCart = (req, res) => {
//   let addToCart = `INSERT INTO carts(product_id)VALUES('${req.params.id}')`;

//   sql.query(addToCart, (err, result) => {
//     if (err) throw err;
//     res.json({
//       message: "product Added to the Cart",
//       result: result,
//     });
//   });
// };

// exports.getProductsFromCart = (req, res) => {
//   let getProductsFromCart = `SELECT products.id,products.name,products.final_price,product_images.file_name from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN carts ON carts.product_id = products.id GROUP BY products.name; SELECT product_stock.product_id,product_stock.color from product_stock INNER JOIN carts ON carts.product_id = product_stock.product_id`;

//   sql.query(getProductsFromCart, (err, result) => {
//     if (err) throw err;

//     res.json({
//       product: result[0],
//       stock: result[1],
//     });
//   });
// };

// exports.deleteFromCart = (req, res) => {
//   sql.query(
//     `DELETE FROM carts WHERE product_id = '${req.params.id}'`,
//     (err, result) => {
//       if (err) throw err;
//     }
//   );
// };

// exports.getCartCount = (req, res) => {
//   sql.query(`SELECT COUNT(id) FROM carts`, (err, result) => {
//     if (err) throw err;
//     res.status(200).json(result);
//   });
// };
