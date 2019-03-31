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
}

module.exports = Auth;
