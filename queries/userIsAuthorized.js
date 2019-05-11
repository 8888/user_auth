const db = require('../db');
const sql = require('../db/sql.js');

module.exports = async (username) => {
  // TODO: update based on sessions table usage and expiration of tokens 
  return await db.exists(sql`
    select *
    from users
    join sessions on users.id = sessions.user_id
    where users.username = ${username}
  `);
};
