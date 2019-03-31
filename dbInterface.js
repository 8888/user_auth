'use strict';

const { Pool } = require('pg');

class DbInterface {
  constructor() {
    this.pool = new Pool({
      connectionString: 'postgresql://postgres:docker@localhost:5432/user_auth'
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
      INSERT INTO user_auth (token)
      VALUES ($1)
      WHERE username=$2;
    `;
    const values = [token, username];
    try {
      await this.pool.query(text, values);
    } catch(err) {
      console.log('Error executing query', err.stack);
    }
  }

  async addUser(salt, token, username, passHash) {
    const text = `
      INSERT INTO user_auth.auth (salt, token, username, pass_hash)
      VALUES ($1, $2, $3, $4);
    `;
    const values = [salt, token, username, passHash];
    try {
      await this.pool.query(text, values);
    } catch(err) {
      console.log('Error executing query', err.stack);
    }
  }
}

module.exports = DbInterface;
