const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getDashboardStats, getHealthTimeline, getHealthTrends } = require('../controllers/analyticsController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/timeline', protect, getHealthTimeline);
router.get('/trends', protect, getHealthTrends);

module.exports = router;
