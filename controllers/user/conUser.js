const sqlConfig = require("../../database/dbConfig")
let sql = sqlConfig.mysql_pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.addUser = async (req, res) => {
  const { name, email, password } = req.body;

  let hashedPass = await bcrypt.hash(password, 8);

  sql.query(
    `SELECT email FROM users WHERE email = '${email}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.send("User Already Exist");
      }

      let addUser = `INSERT INTO users(full_name,email,password) VALUES('${name}','${email}','${hashedPass}')`;
      sql.query(addUser, (err, result) => {
        if (err) throw err;
      });

      //Email Verification
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "memonkamran25@gmail.com",
          pass: "kammo@786",
        },
      });

      sql.query(
        `SELECT id FROM users WHERE email='${email}'`,
        (err, result) => {
          if (err) throw err;

          jwt.sign(
            {
              userId: result[0].id,
            },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "3d",
            },
            (err, emailToken) => {
              if (err) throw err;
              const url =
                process.env.HOST_URL + "/user/confirmation/" + emailToken;

              transporter.sendMail({
                to: email,
                subject: "Confirm Email",
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
              });
            }
          );
          return res.send(
            "Verification Link has been sent your registered Email Id"
          );
        }
      );
    }
  );
};

exports.verifyEmail = (req, res) => {
  let token = req.params.token;
  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    sql.query(
      `UPDATE users SET verification='confirmed' WHERE id='${req.user.userId}'`,
      (err, result) => {
        if (err) throw err;
        res.redirect(`${process.env.CLIENT_URL}/user/login`);
      }
    );
  } catch (err) {
    res.send(err);
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  let loginQuery = `SELECT * FROM users WHERE email = '${email}'`;

  sql.query(loginQuery, async (err, result) => {
    if (err) throw err;
    if (result.length < 1) {
      return res.send({ message: "Email Does not exist" });
    } else if (!(await bcrypt.compare(password, result[0].password))) {
      return res.send({
        message: "Email Or password is Incorrect",
      });
    }

    // Check if the Email is verified
    let verifiedEmail = `SELECT * FROM users WHERE email = '${email}' AND verification = 'confirmed'`;

    sql.query(verifiedEmail, (err, result) => {
      if (err) throw err;
      if (result.length < 1) {
        return res.send({
          message: "Email Not Verified",
        });
      }

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
    });
  });
};

exports.addToUserCart = (req, res) => {
  let productId = req.body.productId;

  //Removing Dups caused when getting products from Cookies
  let removeDuplicates = `DELETE t1 FROM carts t1
  INNER JOIN carts t2
  WHERE
      t1.id < t2.id AND
      t1.user_id = t2.user_id AND
      t1.product_id = t2.product_id;`;

  sql.query(removeDuplicates, (err, result) => {
    if (err) throw err;
  });

  if (Array.isArray(productId)) {
    let arrData = [];
    productId.forEach((item) => {
      arrData.push([req.user.userId, item]);
    });

    let addArrIntoDB = `INSERT INTO carts(user_id,product_id)VALUES ?`;
    sql.query(addArrIntoDB, [arrData], (err, result) => {
      if (err) throw err;
      res.send("Product added to the Cart");
    });
    return;
  }

  let addQuery = `INSERT INTO carts(user_id,product_id) VALUES('${req.user.userId}','${productId}')`;
  sql.query(addQuery, (err, result) => {
    if (err) throw err;
    res.send("Product added to the Cart");
  });
};

exports.getProductsFromUsersCart = (req, res) => {
  let getUserProductsFromCart = `SELECT products.id,products.name,products.final_price,product_images.file_name from products INNER JOIN product_stock ON products.id = product_stock.product_id INNER JOIN product_images on product_stock.id = product_images.stock_id INNER JOIN carts ON carts.product_id = products.id WHERE carts.user_id =${req.user.userId} GROUP BY products.name; SELECT product_stock.product_id,product_stock.color from product_stock INNER JOIN carts ON carts.product_id = product_stock.product_id WHERE carts.user_id =${req.user.userId} GROUP BY product_stock.color`;
  sql.query(getUserProductsFromCart, (err, result) => {
    if (err) throw err;
    res.json({
      product: result[0],
      stock: result[1],
    });
  });
};

exports.userProfile = (req, res) => {
  let userInfo = `SELECT id,full_name,email from users WHERE id = '${req.user.userId}'; SELECT phone,address,pincode, city,state FROM user_details WHERE user_id = '${req.user.userId}'`;

  sql.query(userInfo, (err, result) => {
    if (err) throw err;
    res.json({
      userDetails: result[0],
      addresses: result[1],
    });
  });
};

exports.DeleteFromUserCart = (req, res) => {
  sql.query(
    `DELETE FROM carts WHERE user_id = '${req.user.userId}' AND product_id = ${req.params.id}`,
    (err, result) => {
      if (err) throw err;
      res.send("Details Updated");
    }
  );
};

exports.getLocations = (req, res) => {
  let getLocations = "SELECT state from states; SELECT city from cities";

  sql.query(getLocations, (err, result) => {
    if (err) throw err;
    res.json({
      states: result[0],
      cities: result[1],
    });
  });
};

exports.addUserDetails = (req, res) => {
  const { phone, address, pincode, city, state } = req.body;

  let insertUserDetails = `INSERT INTO user_details(user_id,phone,address,pincode,city,state)VALUES('${req.user.userId}','${phone}','${address}','${pincode}','${city}','${state}')`;

  sql.query(insertUserDetails, (err, result) => {
    if (err) throw err;
    res.send("user Details added");
  });
};

exports.updateUserDetails = (req, res) => {
  const { phone, address, pincode, city, state } = req.body;
  let oldAddress = req.params.address;

  let updateQuery = `UPDATE user_details set phone = '${phone}', address= '${address}', pincode = '${pincode}', city='${city}',state='${state}' WHERE address = '${oldAddress}'`;

  sql.query(updateQuery, (err, result) => {
    if (err) throw err;
    res.send(`address Delete`);
  });
};

exports.deleteUserDetails = (req, res) => {
  let oldAddress = req.body.oldAddress;

  sql.query(
    `DELETE FROM user_details WHERE address= '${oldAddress}'`,
    (err, result) => {
      if (err) throw err;
      res.send(`Address Deleted`);
    }
  );
};
