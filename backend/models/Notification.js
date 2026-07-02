const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String, enum: ['medicine_reminder', 'appointment', 'report_ready', 'ai_analysis',
      'message', 'system', 'emergency'], required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' },
  metadata: { type: Map, of: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
