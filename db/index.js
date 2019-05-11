const { Pool } = require('pg');

const pool = new Pool({ connectionString: 'postgresql://localhost/user_auth' });

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
  exists: async (sqlObject) => {
    sqlObject.text = `SELECT EXISTS(${sqlObject.text})`;
    const result = await pool.query(sqlObject);
    return result.rows[0].exists;
  }
}
