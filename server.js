'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('./auth.js');

const allowCrossOrigin = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const app = express();
app.use(bodyParser.json());
app.use(allowCrossOrigin);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});

const auth = new Auth();

app.post('/user/register', async (req, res) => {
  const credentials = req.body;
  if (credentials.username && credentials.password) {
    const result = await auth.registerUser(credentials.username, credentials.password);
    if (result.success) {
      res.status(201).json({status: 201, user: credentials.username});
    } else {
      res.status(409).json({status: 409, error: result.message});
    }
  } else {
    res.status(400).json({status: 400, error: 'Data is invalid'});
  }
});

app.post('/user/login', async (req, res) => {
  const credentials = req.body;
  if (credentials.username && credentials.password) {
    const result = await auth.loginUser(credentials.username, credentials.password);
    if (result.success) {
      res.status(200).json({status: 200, token: result.token, username: credentials.username});
    } else {
      res.status(401).json({status: 401, error: result.message});
    }
  } else {
    res.status(400).json({status: 400, error: 'Data is invalid'});
  }
});
