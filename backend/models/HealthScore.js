const mongoose = require('mongoose');

const healthScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  breakdown: {
    bmiScore: Number,
    reportScore: Number,
    lifestyleScore: Number,
    predictionScore: Number,
    activityScore: Number
  },
  suggestions: [String],
  previousScore: Number,
  trend: { type: String, enum: ['improving', 'stable', 'declining'] },
  calculatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('HealthScore', healthScoreSchema);
