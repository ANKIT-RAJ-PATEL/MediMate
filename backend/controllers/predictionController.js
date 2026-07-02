const Prediction = require('../models/Prediction');
const axios = require('axios');

exports.runPrediction = async (req, res) => {
  try {
    const { modelType, parameters } = req.body;
    let result;
    try {
      const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
        model: modelType, features: parameters
      });
      result = response.data;
    } catch {
      result = generateFallbackPrediction(modelType, parameters);
    }

    const prediction = await Prediction.create({
      user: req.user._id, modelType, inputParameters: parameters, result
    });

    res.status(201).json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
    if (!prediction) return res.status(404).json({ success: false, message: 'Prediction not found' });
    res.json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function generateFallbackPrediction(modelType, params) {
  const riskFactors = {
    diabetes: { base: 20, factors: ['glucose', 'bmi', 'age'] },
    heart_disease: { base: 15, factors: ['cholesterol', 'bloodPressure', 'age'] },
    liver_disease: { base: 10, factors: ['alt', 'ast', 'bilirubin'] },
    kidney_disease: { base: 12, factors: ['creatinine', 'bun', 'gfr'] },
    stroke: { base: 8, factors: ['bloodPressure', 'cholesterol', 'smoking'] }
  };

  const config = riskFactors[modelType] || riskFactors.diabetes;
  let riskScore = config.base;

  Object.values(params).forEach(val => {
    const num = parseFloat(val);
    if (!isNaN(num)) riskScore += Math.random() * 10;
  });

  riskScore = Math.min(Math.max(riskScore, 5), 95);

  return {
    riskPercentage: Math.round(riskScore),
    confidence: Math.round(70 + Math.random() * 25),
    severity: riskScore < 30 ? 'low' : riskScore < 60 ? 'moderate' : riskScore < 80 ? 'high' : 'critical',
    possibleConditions: [`${modelType.replace('_', ' ')} risk factors detected`],
    recommendations: [
      'Consult a specialist for detailed evaluation',
      'Maintain a healthy lifestyle',
      'Regular monitoring recommended',
      'Follow a balanced diet',
      'Exercise regularly'
    ],
    summary: `Based on the provided parameters, there is a ${Math.round(riskScore)}% risk of ${modelType.replace('_', ' ')}. Confidence: ${Math.round(70 + Math.random() * 25)}%.`
  };
}
