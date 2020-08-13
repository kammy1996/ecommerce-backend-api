import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

let sqlConfig = {
  mysql_pool: mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  }),
};

export default sqlConfig;
