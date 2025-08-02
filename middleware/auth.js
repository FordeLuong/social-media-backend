const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware xác thực người dùng
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Lỗi xác thực:', error);
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  } else {
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }
};

module.exports = auth ;
