const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// accessible to any logged-in user
router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user: req.user
  });
});

// admin only
router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

// agent only
router.get('/agent', authenticateToken, authorizeRoles('agent'), (req, res) => {
  res.json({ message: 'Welcome Agent' });
});

module.exports = router;