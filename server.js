// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// --- CẤU HÌNH ---
dotenv.config();
const app = express();

// Sử dụng các middleware cần thiết
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Parse body của request thành JSON

// --- KẾT NỐI DATABASE ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Thoát khỏi tiến trình nếu không kết nối được DB
    process.exit(1);
  }
};

connectDB();

// --- ĐỊNH NGHĨA ROUTES ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Sử dụng authRoutes cho các đường dẫn bắt đầu bằng /api/auth
app.use('/api/auth', require('./routes/authRoutes.js'));

// Sử dụng userRoutes cho các đường dẫn bắt đầu bằng /api/users
app.use('/api/users', require('./routes/userRoutes.js'));

// Sử dụng postRoutes cho các đường dẫn bắt đầu bằng /api/posts
app.use('/api/posts', require('./routes/postRoutes.js')); // <-- DÒNG MỚI ĐƯỢC THÊM

// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});