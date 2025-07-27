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

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (hoặc Private nếu bạn muốn)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    // Nếu ID không đúng định dạng của MongoDB, nó sẽ throw lỗi
    if(error.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};


module.exports = {
  getMe,
  getUserById, 
};