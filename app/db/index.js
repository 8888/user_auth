const { Pool } = require('pg');

const pool = new Pool({ connectionString: 'postgresql://localhost/user_auth' });

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback)
}
