const express = require('express');
const { createUser } = require('../services/user.service');
const { Log } = require('../middleware/log');

const router = express.Router();

router.post('/user', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const user = createUser({ name, email });
    await Log('backend', 'info', 'user.routes', `User created: ${user.id}`);
    return res.status(201).json(user);
  } catch (err) {
    await Log('backend', 'error', 'user.routes', 'Failed to create user');
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
