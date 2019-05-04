const db = require('../db');
const sql = require('../db/sql.js');

module.exports = async (username, password) => {
  return await db.exists(sql`select * from users where username = ${username} and password = ${password}`);
};
