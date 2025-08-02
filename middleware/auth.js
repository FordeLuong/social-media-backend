const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Middleware xác thực người dùng
const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra nếu có token theo chuẩn Bearer
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // bỏ mật khẩu khi gán user
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Token không hợp lệ');
    }
  } else {
    res.status(401);
    throw new Error('Không có token, truy cập bị từ chối');
  }
});

module.exports = { auth };
