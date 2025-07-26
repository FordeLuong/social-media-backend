// controllers/authController.js

const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

// Hàm tạo token để tái sử dụng
const generateToken = (id) => {
  return jwt.sign({ user: { id } }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// Phần Đăng ký không cần thay đổi, vẫn yêu cầu cả username, email, password
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        if(userExists.email === email) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        if(userExists.username === username) {
            return res.status(400).json({ msg: 'Username already exists' });
        }
    }
    
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ msg: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  // --- THAY ĐỔI 1: Lấy `username` và `password` từ body ---
  const { username, password } = req.body;

  try {
    // --- THAY ĐỔI 2: Tìm user bằng `username` thay vì `email` ---
    const user = await User.findOne({ username });

    // Nếu user tồn tại VÀ mật khẩu khớp
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // --- THAY ĐỔI 3: Cập nhật thông báo lỗi cho rõ ràng ---
      res.status(401).json({ msg: 'Invalid username or password' });
    }
  } catch (error)
  {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};