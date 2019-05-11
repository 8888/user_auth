'use strict';

const crypto = require('crypto');

const usernameExists = require('./queries/usernameExists');
const userIsAuthorized = require('./queries/userIsAuthorized');
const fetchUser = require('./queries/fetchUser');
const setToken = require('./services/setToken');
const addUser = require('./services/addUser');

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

const loginUser = async (user, pass) => {
  let response = {
    success: false,
    message: 'Either the username or password is incorrect',
    token: '',
  };

  const { username, salt, password } = await fetchUser(user);
  if (username && salt && password) {
    const hash = hashPassword(pass, salt);
    if (hash === password) {
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
