const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { startTime: String, endTime: String },
  status: {
    type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rescheduled'],
    default: 'pending'
  },
  reason: { type: String, default: '' },
  notes: { type: String, default: '' },
  prescription: {
    medicines: [{ name: String, dosage: String, frequency: String, duration: String, instructions: String }],
    diagnosis: String,
    followUpDate: Date,
    notes: String
  },
  consultationType: { type: String, enum: ['online', 'in-person'], default: 'in-person' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  amount: { type: Number, default: 0 },
  cancellationReason: String,
  rescheduledTo: Date
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
