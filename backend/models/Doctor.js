const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true },
  licenseNumber: { type: String, required: true },
  hospital: { type: String, default: '' },
  consultationFee: { type: Number, default: 0 },
  availableSlots: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: String,
    endTime: String,
    isAvailable: { type: Boolean, default: true }
  }],
  ratings: { type: Number, default: 0 },
  totalPatients: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  languages: [String],
  achievements: [String]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
