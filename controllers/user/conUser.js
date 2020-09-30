import sqlConfig from "../../database/dbConfig";
let sql = sqlConfig.mysql_pool;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

exports.addUser = async (req, res) => {
  const { name, email, password } = req.body;

  let hashedPass = await bcrypt.hash(password, 8);

  let checkEmailExist = `SELECT email FROM users WHERE email = '${email}'`;

  sql.query(checkEmailExist, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.send("User Already Exist");
    }

    let addUser = `INSERT INTO users(full_name,email,password) VALUES('${name}','${email}','${hashedPass}')`;

    sql.query(addUser, (err, result) => {
      if (err) throw err;
      return res.send("User Registered");
    });
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  let loginQuery = `SELECT * FROM users WHERE email = '${email}'`;

  sql.query(loginQuery, async (err, result) => {
    if (err) throw err;

    if (!result || !(await bcrypt.compare(password, result[0].password))) {
      return res.send("Email Or password is Incorrect");
    } else {
      const token = jwt.sign(
        {
          userId: result[0].id,
        },
        process.env.TOKEN_SECRET
      );
      res.header("Auth-token", token).json({
        token: token,
        user: {
          email: result[0].email,
          password: result[0].password,
        },
      });
    }
  });
};

exports.addToUserCart = (req, res) => {
  let addQuery = `INSERT INTO carts(user_id,product_id) VALUES('${req.user.userId}','${req.params.id}')`;
  sql.query(addQuery, (err, result) => {
    if (err) throw err;
    res.send("Product added to the Cart");
  });
};

exports.getProductsFromUsersCart = (req, res) => {
  let getUserProductsFromCart = `SELECT products.id,products.name,products.final_price,product_images.file_name from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN carts ON carts.product_id = products.id GROUP BY products.name; SELECT product_stock.product_id,product_stock.color from product_stock INNER JOIN carts ON carts.product_id = product_stock.product_id WHERE carts.user_id =${req.user.userId} GROUP BY product_stock.color`;
  sql.query(getUserProductsFromCart, (err, result) => {
    if (err) throw err;
    res.json({
      product: result[0],
      stock: result[1],
    });
  });
};

exports.userProfile = (req, res) => {
  let userInfo = `SELECT * FROM users WHERE id = '${req.user.userId}'`;

  sql.query(userInfo, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};

exports.DeleteFromUserCart = (req, res) => {
  sql.query(
    `DELETE FROM carts WHERE user_id = '${req.user.userId}' AND product_id = ${req.params.id}`,
    (err, result) => {
      if (err) throw err;
    }
  );
};
