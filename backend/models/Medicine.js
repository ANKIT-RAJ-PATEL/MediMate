const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, enum: ['once_daily', 'twice_daily', 'thrice_daily', 'weekly', 'as_needed'], required: true },
  times: [String],
  days: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
  startDate: { type: Date, required: true },
  endDate: Date,
  instructions: { type: String, default: '' },
  category: { type: String, enum: ['prescription', 'otc', 'supplement', 'other'], default: 'prescription' },
  isActive: { type: Boolean, default: true },
  refillReminder: { type: Boolean, default: false },
  quantity: { type: Number, default: 0 },
  sideEffects: [String],
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  history: [{
    action: { type: String, enum: ['taken', 'missed', 'skipped'] },
    scheduledTime: Date,
    actualTime: Date,
    notes: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
