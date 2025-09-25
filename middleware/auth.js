const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware xác thực người dùng
const auth = async (req, res, next) => {
  // 1. Lấy header 'authorization' từ request đến
  const authHeader = req.headers.authorization;

  // 2. Kiểm tra xem header có tồn tại và có đúng định dạng "Bearer [token]" không
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      // 3. Giải mã và xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Lấy thông tin người dùng từ database
      const user = await User.findById(decoded.id).select('-password');

      // Kiểm tra xem người dùng tương ứng với token có còn tồn tại trong DB không
      if (!user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      // 5. Gán thông tin người dùng vào đối tượng request (req)
      req.user = user;

      // 6. Cho phép request đi tiếp đến xử lý tiếp theo (controller)
      next();
    } catch (error) {
      console.error('Lỗi xác thực:', error);
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  } else {
    // Nếu không có header 'authorization' hoặc không đúng định dạng
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }
};

// Export middleware để các file route có thể sử dụng
module.exports = auth ;
