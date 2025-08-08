// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Import middleware bảo vệ

// Import các hàm controller
const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require('../controllers/messageController');

// --- Định nghĩa các Routes ---

// @route   POST /api/messages
// Gửi một tin nhắn mới.
router.route('/').post(protect, sendMessage);

// @route   GET /api/messages/:conversationId
// Lấy tất cả tin nhắn của một cuộc trò chuyện.
router.route('/:conversationId').get(protect, getMessages);

// @route   DELETE /api/messages/:messageId  (Lưu ý: :messageId ở đây)
// Xóa một tin nhắn cụ thể (chỉ chủ tin nhắn mới có quyền).
// Tôi giả sử param là messageId để rõ ràng hơn.
router.route('/:messageId').delete(protect, deleteMessage);

module.exports = router;