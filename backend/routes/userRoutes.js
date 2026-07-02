const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/auth');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
