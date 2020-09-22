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
        { userId: result[0].id },
        process.env.TOKEN_SECRET
      );
      res.header("Auth-token", token).send(token);
    }
  });
};

exports.userProfile = (req, res) => {
  let userInfo = `SELECT * FROM users`;

  sql.query(userInfo, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
};
