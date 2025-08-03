const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

// ✅ Tạo token với id trực tiếp
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  console.log('=== DEBUG INFO ===');
  console.log('req.method:', req.method);
  console.log('req.headers:', req.headers);
  console.log('req.body:', req.body);
  console.log('typeof req.body:', typeof req.body);
  console.log('==================');

  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
      if (userExists.username === username) {
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
        token: generateToken(user._id), // ✅ Token mới với { id }
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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // ✅ Token mới với { id }
      });
    } else {
      res.status(401).json({ msg: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
