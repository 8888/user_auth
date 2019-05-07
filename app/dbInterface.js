'use strict';

const { Pool } = require('pg');

class DbInterface {
  constructor() {
    this.pool = new Pool({
      connectionString: 'postgresql://localhost/user_auth'
    });
  }

  async fetchSalt(username) {
    let response = {
      success: false,
      salt: '',
    };
    const text = `
      SELECT salt
      FROM user_auth.auth
      WHERE username=$1;
    `;
    const values = [username];
    try {
      const result = await this.pool.query(text, values);
      if (result.rowCount) {
        response.success = true;
        response.salt = result.rows[0].salt;
      }
    } catch(err) {
      console.log('Error executing query', err.stack);
    }
    return response;
  }
}

module.exports = DbInterface;
