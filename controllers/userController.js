// controllers/userController.js

const User = require('../models/userModel.js');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  // Middleware 'auth' đã tìm và gắn user vào 'req.user'
  // Chúng ta chỉ cần trả về thông tin đó
  res.status(200).json(req.user);
};

module.exports = {
  getMe,
};