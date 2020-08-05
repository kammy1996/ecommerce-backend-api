import mysql from "mysql";

let sqlConfig = {
  mysql_pool: mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  }),
};

console.log("Database Connected");

module.exports = sqlConfig;
