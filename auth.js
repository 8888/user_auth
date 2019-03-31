'use strict';

const crypto = require('crypto');
const DbInterface = require('./dbInterface.js');

class Auth {
  constructor() {
    this.dbInterface = new DbInterface();
  }

  generateRandomValue() {
    return crypto.randomBytes(32).toString('hex');
  }

  hashPassword(secret, salt) {
    const hash = crypto.pbkdf2Sync(secret, salt, 100000, 64, 'sha256');
    return hash.toString('hex');
  }

  async registerUser(username, password) {
    let response = {
      success: false,
      message: '',
    };
    if (await this.dbInterface.userNameExists(username)) {
      response.message = 'username already exists!';
    } else {
      const salt = this.generateRandomValue();
      const hash = this.hashPassword(password, salt);
      if (await this.dbInterface.addUser(salt, username, hash)) {
        response.success = true;
        response.message = 'Registration successful!';
      } else {
        response.message = 'Error registering user, please try again!';
      }
    }
    return response;
  }

  async loginUser(username, password) {
    let response = {
      success: false,
      message: 'Either the username or password is incorrect',
      token: '',
    };
    const saltResult = await this.dbInterface.fetchSalt(username);
    if (saltResult.success) {
      const hash = this.hashPassword(password, saltResult.salt);
      if (await this.dbInterface.userAndPassMatches(username, hash)) {
        const token = this.generateRandomValue();
        if (await this.dbInterface.setToken(username, token)) {
          response.success = true;
          response.token = token;
          response.message = 'Login successful!'
        }
      }
    }
    return response;
  }

  async authorizeUser(username, token) {
    let response = {
      success: false,
      message: 'User is not authenticated!',
    };
    if (await this.dbInterface.userIsAuthorized(username, token)) {
      response.success = true;
      response.message = 'User is authenticated'
    }
    return response;
  }
}

module.exports = Auth;
