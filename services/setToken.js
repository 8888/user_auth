const db = require('../db');
const sql = require('../db/sql.js');

module.exports = async (username, token) => {
  return await db.query(sql`
    insert into sessions(token, created_at, user_id)
    values (${token}, current_timestamp,
      (select id from users where username = ${username})
    )
  `);
};
