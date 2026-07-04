const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, refreshToken, forgotPassword, resetPassword, googleLogin, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
