const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sources: [{ title: String, content: String, relevance: Number }],
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }
  }],
  context: {
    activeReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    patientProfile: Object
  },
  title: { type: String, default: 'New Conversation' },
  isActive: { type: Boolean, default: true },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
