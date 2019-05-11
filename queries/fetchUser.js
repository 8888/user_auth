const db = require('../db');
const sql = require('../db/sql.js');

module.exports = async (username) => {
  const result = await db.query(sql`select username, salt, password from users where username = ${username}`);
  if (result.rows.length) return result.rows[0];
};
