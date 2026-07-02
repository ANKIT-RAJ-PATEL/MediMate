const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { calculateHealthScore, getLatestScore, getScoreHistory } = require('../controllers/healthController');

router.post('/score/calculate', protect, calculateHealthScore);
router.get('/score', protect, getLatestScore);
router.get('/score/history', protect, getScoreHistory);

module.exports = router;
