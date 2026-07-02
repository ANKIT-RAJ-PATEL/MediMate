const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modelType: {
    type: String, enum: ['diabetes', 'heart_disease', 'liver_disease', 'kidney_disease', 'stroke'],
    required: true
  },
  inputParameters: { type: Map, of: String },
  result: {
    riskPercentage: { type: Number, required: true },
    confidence: { type: Number, required: true },
    severity: { type: String, enum: ['low', 'moderate', 'high', 'critical'], required: true },
    possibleConditions: [String],
    recommendations: [String],
    summary: String
  },
  reportUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', predictionSchema);
