// controllers/messageController.js

const Message = require('../models/messageModel');

// @desc    Gửi tin nhắn
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  if (!conversationId || !text) {
    return res.status(400).json({ message: 'Cần có conversationId và nội dung tin nhắn' });
  }
  try {
    const newMessage = new Message({
      conversationId,
      text,
      sender: req.user.id, // 2. Cập nhật lại sender
    });

    const savedMessage = await newMessage.save();
    
    // Populate thông tin người gửi trước khi trả về cho client
    // Giúp client hiển thị avatar và username ngay lập tức
    await savedMessage.populate('sender', 'username avatar');
    
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy tin nhắn trong một cuộc trò chuyện
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId })
      .populate('sender', 'username avatar') // Đổi 'author' thành 'sender' cho nhất quán
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Phần xóa tin nhắn có thể giữ lại hoặc bỏ đi tùy ý
const deleteMessage = async (req, res) => {
    // ...
};

// 1. Giữ nguyên cách export ở dưới
module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};