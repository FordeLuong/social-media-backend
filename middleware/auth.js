// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const auth = async (req, res, next) => {
  let token;

  // Client sẽ gửi token trong header Authorization theo dạng 'Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Lấy token ra khỏi header (Bỏ đi chữ 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // 2. Giải mã token để lấy payload (chứa id của user)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Tìm user trong DB bằng id từ token và gắn vào request
      // Dùng .select('-password') để không lấy trường password về
      req.user = await User.findById(decoded.user.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ msg: 'User not found, authorization denied' });
      }

      // 4. Cho phép request đi tiếp
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
  }
};

module.exports = auth;