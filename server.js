// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
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


// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});