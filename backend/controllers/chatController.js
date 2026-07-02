const Chat = require('../models/Chat');
const Report = require('../models/Report');
const User = require('../models/User');
const axios = require('axios');

exports.createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      title: req.body.title || 'New Conversation',
      context: { activeReport: req.body.reportId }
    });
    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id, isActive: true })
      .sort({ lastMessageAt: -1 }).limit(50);
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, reportId } = req.body;
    let chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    chat.messages.push({ role: 'user', content: message });

    let contextData = '';
    if (reportId) {
      const report = await Report.findById(reportId);
      if (report?.extractedText) contextData += `Report Data: ${report.extractedText}\n`;
      if (report?.aiAnalysis?.summary) contextData += `AI Analysis: ${report.aiAnalysis.summary}\n`;
    }

    const user = await User.findById(req.user._id);
    const userProfile = `Patient: ${user.name}, Age: ${user.dateOfBirth ? Math.floor((Date.now() - user.dateOfBirth) / 31557600000) : 'N/A'}, Blood Group: ${user.bloodGroup || 'N/A'}`;

    try {
      const response = await axios.post(`${process.env.ML_SERVICE_URL}/chat`, {
        message, context: contextData, userProfile,
        history: chat.messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
      });

      const assistantMessage = response.data.response;
      chat.messages.push({ role: 'assistant', content: assistantMessage, sources: response.data.sources || [] });
    } catch {
      chat.messages.push({
        role: 'assistant',
        content: "I'm having trouble connecting to the AI service. Please try again later."
      });
    }

    chat.lastMessageAt = new Date();
    await chat.save();

    res.json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isActive: false });
    res.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
