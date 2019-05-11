const express = require('express');
const router = express.Router();

const auth = require('../auth');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const result = await auth.registerUser(username, password);
    if (result.success) {
      res.status(201).json({ username });
    } else {
      res.status(409).json({ error: result.message });
    }
  } else {
    res.status(400).json({ error: 'Data is invalid' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const result = await auth.loginUser(username, password);
    if (result.success) {
      res.status(200).json({ token: result.token, username });
    } else {
      res.status(401).json({ error: result.message });
    }
  } else {
    res.status(400).json({ error: 'Data is invalid' });
  }
});

router.post('/confirmToken', async (req, res) => {
  const { username, token } = req.body;
  if (username && token) {
    const result = await auth.authorizeUser(username, token);
    if (result.success) {
      res.status(200).json({ username });
    } else {
      res.status(401).json({ error: result.message });
    }
  } else {
    res.status(401).json({ error: 'User is not authenticated!' });
  }
});

module.exports = router;
