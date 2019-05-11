const db = require('../db');
const sql = require('../db/sql.js');

module.exports = async (username) => {
  return await db.exists(sql`select * from users where username = ${username}`);
};
