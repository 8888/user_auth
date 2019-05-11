'use strict';

const crypto = require('crypto');

const usernameExists = require('./queries/usernameExists.js');
const userAndPassMatches = require('./queries/userAndPassMatches.js');
const userIsAuthorized = require('./queries/userIsAuthorized.js');
const fetchSalt = require('./queries/fetchSalt.js');
const setToken = require('./services/setToken.js');
const addUser = require('./services/addUser.js');

const generateRandomValue = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
}

const hashPassword = (secret, salt) => {
  const hash = crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
  return hash.toString('hex');
}

const registerUser = async (username, password) => {
  let response = {
    success: false,
    message: '',
  };
  if (await usernameExists(username)) {
    response.message = 'username already exists!';
  } else {
    const salt = generateRandomValue();
    const hash = hashPassword(password, salt);
    if (await addUser(username, hash, salt)) {
      response.success = true;
      response.message = 'Registration successful!';
    } else {
      response.message = 'Error registering user, please try again!';
    }
  }
  return response;
}

const loginUser = async (username, password) => {
  let response = {
    success: false,
    message: 'Either the username or password is incorrect',
    token: '',
  };
  const salt = await fetchSalt(username);
  if (salt) {
    const hash = hashPassword(password, salt);
    if (await userAndPassMatches(username, hash)) {
      const token = generateRandomValue(16);
      if (await setToken(username, token)) {
        response.success = true;
        response.token = token;
        response.message = 'Login successful!'
      }
    }
  }
  return response;
}

const authorizeUser = async (username, token) => {
  let response = {
    success: false,
    message: 'User is not authenticated!',
  };
  if (await userIsAuthorized(username, token)) {
    response.success = true;
    response.message = 'User is authenticated'
  }
  return response;
}

const logout = async (username) => {
  // TODO: expire token
}

module.exports = {
  registerUser,
  loginUser,
  authorizeUser,
  logout
};
