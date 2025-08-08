// models/conversationModel.js
const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
    // Mảng chứa ID của 2 người tham gia
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
module.exports = mongoose.model('Conversation', conversationSchema);