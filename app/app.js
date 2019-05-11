'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const auth = require('./auth.js');

const allowCrossOrigin = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const app = express();
app.use(bodyParser.json());
app.use(allowCrossOrigin);
app.use('/users', usersRouter);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});

app.post('/user/logout', async (req, res) => {
  const username = req.body.username;
  if (username) {
    await auth.logout(username);
    res.status(200).json({status: 200});
  } else {
    res.status(400).json({status: 400, error: 'Data is invalid'});
  }
});
