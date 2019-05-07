const db = require('../db');
const sql = require('../db/sql.js');

module.exports = async (username, password, salt) => {
  return await db.query(sql`
    insert into users (username, password, salt)
    values (${username}, ${password}, ${salt});
  `);
};
