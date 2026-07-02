const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  reportType: {
    type: String, enum: ['blood_test', 'cbc', 'lipid_profile', 'thyroid',
      'liver_function', 'kidney_function', 'diabetes', 'xray', 'mri', 'other'],
    required: true
  },
  fileUrl: { type: String, required: true },
  publicId: { type: String },
  fileType: { type: String, enum: ['pdf', 'jpg', 'png', 'jpeg'] },
  extractedText: { type: String, default: '' },
  structuredData: {
    parameters: [{
      name: String,
      value: String,
      unit: String,
      referenceRange: String,
      status: { type: String, enum: ['normal', 'low', 'high', 'critical'] }
    }]
  },
  aiAnalysis: {
    summary: String,
    riskLevel: { type: String, enum: ['low', 'moderate', 'high', 'critical'] },
    explanations: [{
      parameter: String,
      explanation: String,
      recommendation: String
    }],
    lifestyleRecommendations: {
      diet: [String],
      exercise: [String],
      foods_to_avoid: [String],
      suggestedSpecialist: String
    },
    generatedAt: Date
  },
  ocrStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  analysisStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
