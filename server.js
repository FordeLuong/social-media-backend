// server.js (Đã sửa lỗi)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// --- 1. CẤU HÌNH BAN ĐẦU ---
dotenv.config();
const app = express();


// --- 2. HÀM HELPER (ĐỊNH NGHĨA TRƯỚC KHI GỌI) ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};


// --- 3. KẾT NỐI DATABASE ---
connectDB(); // Bây giờ gọi hàm sẽ không bị lỗi


// --- 4. CẤU HÌNH MIDDLEWARES ---
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());


// --- 5. ĐỊNH NGHĨA ROUTES API ---
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/posts', require('./routes/postRoutes.js')); 
app.use('/api/conversations', require('./routes/conversationRoutes.js'));
app.use('/api/messages', require('./routes/messageRoutes.js'));


// --- 6. TẠO HTTP SERVER VÀ TÍCH HỢP SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // ... các sự kiện socket
});


// --- 7. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});