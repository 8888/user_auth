'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');

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
