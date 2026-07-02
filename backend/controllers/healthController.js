const HealthScore = require('../models/HealthScore');
const User = require('../models/User');
const Report = require('../models/Report');
const Prediction = require('../models/Prediction');

exports.calculateHealthScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let bmiScore = 0, reportScore = 0, lifestyleScore = 0, predictionScore = 0;

    if (user.height && user.weight) {
      const bmi = user.weight / Math.pow(user.height / 100, 2);
      bmiScore = bmi >= 18.5 && bmi <= 24.9 ? 90 : bmi >= 25 && bmi <= 29.9 ? 60 : 30;
    } else { bmiScore = 50; }

    const reports = await Report.find({ user: req.user._id, isDeleted: false, analysisStatus: 'completed' });
    if (reports.length > 0) {
      const normalCount = reports.reduce((acc, r) =>
        acc + (r.structuredData?.parameters?.filter(p => p.status === 'normal').length || 0), 0);
      const totalParams = reports.reduce((acc, r) =>
        acc + (r.structuredData?.parameters?.length || 0), 0);
      reportScore = totalParams > 0 ? (normalCount / totalParams) * 100 : 50;
    } else { reportScore = 50; }

    const hp = user.healthProfile || {};
    lifestyleScore = 50;
    if (hp.exerciseFrequency === 'daily') lifestyleScore += 20;
    else if (hp.exerciseFrequency === 'often') lifestyleScore += 15;
    if (hp.smokingStatus === 'never') lifestyleScore += 15;
    else if (hp.smokingStatus === 'former') lifestyleScore += 5;
    if (hp.sleepHours >= 7 && hp.sleepHours <= 9) lifestyleScore += 15;
    lifestyleScore = Math.min(lifestyleScore, 100);

    const predictions = await Prediction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5);
    if (predictions.length > 0) {
      const avgRisk = predictions.reduce((acc, p) => acc + p.result.riskPercentage, 0) / predictions.length;
      predictionScore = 100 - avgRisk;
    } else { predictionScore = 70; }

    const score = Math.round(bmiScore * 0.2 + reportScore * 0.3 + lifestyleScore * 0.25 + predictionScore * 0.25);
    const previousScore = await HealthScore.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const trend = !previousScore ? 'stable' : score > previousScore.score + 3 ? 'improving' :
      score < previousScore.score - 3 ? 'declining' : 'stable';

    const suggestions = [];
    if (bmiScore < 70) suggestions.push('Maintain a healthy BMI through diet and exercise');
    if (reportScore < 70) suggestions.push('Follow up on abnormal report values with your doctor');
    if (lifestyleScore < 70) suggestions.push('Improve lifestyle habits - exercise regularly and sleep well');
    if (predictionScore < 70) suggestions.push('Take preventive measures based on your risk predictions');
    if (suggestions.length === 0) suggestions.push('Great job! Keep maintaining your healthy lifestyle.');

    const healthScore = await HealthScore.create({
      user: req.user._id, score,
      breakdown: { bmiScore, reportScore, lifestyleScore, predictionScore },
      suggestions, previousScore: previousScore?.score, trend
    });

    res.json({ success: true, healthScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLatestScore = async (req, res) => {
  try {
    const score = await HealthScore.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, healthScore: score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getScoreHistory = async (req, res) => {
  try {
    const scores = await HealthScore.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
