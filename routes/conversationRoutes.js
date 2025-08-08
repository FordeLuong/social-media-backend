// routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Import middleware bảo vệ

// Import các hàm controller
const {
  createConversation,
  getConversations,
} = require('../controllers/conversationController');

// --- Định nghĩa các Routes ---

// @route   /api/conversations
// GET: Lấy tất cả các cuộc trò chuyện của người dùng đang đăng nhập.
// POST: Tạo một cuộc trò chuyện mới.
router.route('/')
  .get(protect, getConversations)
  .post(protect, createConversation);

module.exports = router;