const express = require('express');
const router = express.Router();

const auth = require('../auth');
const usersController = require('../controllers/users');

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/confirmToken', usersController.confirmToken);

router.post('/logout', async (req, res) => {
  const username = req.body.username;
  if (username) {
    await auth.logout(username);
    res.status(200);
  } else {
    res.status(400).json({ error: 'Data is invalid' });
  }
});

module.exports = router;
