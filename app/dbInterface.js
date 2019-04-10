'use strict';

const { Pool } = require('pg');

class DbInterface {
  constructor() {
    this.pool = new Pool({
      connectionString: 'postgresql://localhost/user_auth'
    });
  }

  async rowExists(text, values) {
    /**
     * Queries the database with the provided query and values
     * returns boolean if the row exists
     * @text string of a SQL query
     * @values array of values used in the query
     */
    try {
      const result = await this.pool.query(text, values);
      return !!result.rowCount;
    } catch(err) {
      console.log('Error executing query', err.stack);
      return false;
    }
  }

  async userNameExists(username) {
    const text = `
      SELECT username
      FROM user_auth.auth
      WHERE username=$1;
    `;
    const values = [username];
    return await this.rowExists(text, values);
  }

  async userAndPassMatches(username, passHash) {
    const text = `
      SELECT id
      FROM user_auth.auth
      WHERE username=$1 AND pass_hash=$2;
    `;
    const values = [username, passHash];
    return await this.rowExists(text, values);
  }

  async userIsAuthorized(username, token) {
    const text = `
      SELECT id
      FROM user_auth.auth
      WHERE username=$1 AND token=$2;
    `;
    const values = [username, token];
    return await this.rowExists(text, values);
  }

  async setToken(username, token) {
    const text = `
      UPDATE user_auth.auth
      SET token=$1
      WHERE username=$2;
    `;
    const values = [token, username];
    try {
      await this.pool.query(text, values);
      return true;
    } catch(err) {
      console.log('Error executing query', err.stack);
      return false;
    }
  }

  async addUser(salt, username, passHash) {
    const text = `
      INSERT INTO user_auth.auth (salt, username, pass_hash)
      VALUES ($1, $2, $3);
    `;
    const values = [salt, username, passHash];
    try {
      await this.pool.query(text, values);
      return true;
    } catch(err) {
      console.log('Error executing query', err.stack);
      return false;
    }
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
