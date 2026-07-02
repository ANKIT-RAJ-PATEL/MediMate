const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { runPrediction, getPredictions, getPredictionById } = require('../controllers/predictionController');

router.post('/predict', protect, runPrediction);
router.get('/', protect, getPredictions);
router.get('/:id', protect, getPredictionById);

module.exports = router;
