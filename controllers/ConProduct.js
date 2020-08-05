//importing SQL Configuration
import sqlConfig from "../database/dbConfig";
let sql = sqlConfig.mysql_pool;

exports.show = (req, res) => {
  sql.query("SELECT * from trial", (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
};
