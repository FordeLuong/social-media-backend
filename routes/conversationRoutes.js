// routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth'); // Import middleware bảo vệ

// Import các hàm controller
const {
  createConversation,
  getConversations,
} = require('../controllers/conversationController');
const auth = require('../middleware/auth');

// --- Định nghĩa các Routes ---

// @route   /api/conversations
// GET: Lấy tất cả các cuộc trò chuyện của người dùng đang đăng nhập.
// POST: Tạo một cuộc trò chuyện mới.
router.route('/')
  .get(auth, getConversations)
  .post(auth, createConversation);

module.exports = router;