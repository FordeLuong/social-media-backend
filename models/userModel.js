// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Tên người dùng là duy nhất
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email là duy nhất
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://i.pravatar.cc/150' // Một avatar mặc định
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Tham chiếu đến mô hình Flower
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Tham chiếu đến mô hình Flower  
  }],
}, {
  timestamps: true, // Tự động thêm 2 trường createdAt và updatedAt
});

// Mã hóa mật khẩu trước khi lưu vào database
UserSchema.pre('save', async function(next) {
  // Chỉ mã hóa nếu mật khẩu được thay đổi (hoặc là người dùng mới)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Thêm một method để so sánh mật khẩu
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;