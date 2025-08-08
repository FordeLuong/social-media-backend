// controllers/conversationController.js

// Sử dụng cú pháp CommonJS (require)
const Conversation = require('../models/conversationModel');

// @desc    Tạo một cuộc trò chuyện mới hoặc lấy cuộc trò chuyện đã có
// @route   POST /api/conversations
// @access  Private
const createConversation = async (req, res) => {
  // 3. Cải thiện logic: API sẽ nhận ID của người nhận
  // và tự động thêm người gửi (là user đang đăng nhập)
  const { receiverId } = req.body;
  const senderId = req.user.id; 

  if (!receiverId) {
    return res.status(400).json({ message: 'Cần có ID của người nhận' });
  }

  // Không cho phép tạo cuộc trò chuyện với chính mình
  if (receiverId === senderId) {
    return res.status(400).json({ message: 'Không thể tạo cuộc trò chuyện với chính mình.' });
  }

  try {
    // Tìm cuộc trò chuyện đã tồn tại chứa cả 2 thành viên
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    // Nếu đã tồn tại, trả về nó thay vì tạo mới
    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Nếu chưa tồn tại, tạo mới
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// @desc    Lấy tất cả cuộc trò chuyện của người dùng
// @route   GET /api/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ members: { $in: [req.user.id] } })
        // 4. Populate trong getConversations:
        // Lấy thông tin chi tiết của các thành viên trong mỗi cuộc trò chuyện
        .populate('members', 'username avatar')
        .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// 1. Giữ nguyên cách export ở dưới
module.exports = {
  createConversation,
  getConversations,
};