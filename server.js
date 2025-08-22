// server.js (Phiên bản Hoàn chỉnh)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { initializeSocket, getUser } = require('./socket.js');

// --- 1. Cấu hình ban đầu ---
dotenv.config();
const app = express();

// --- 2. HÀM HELPER ---
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
connectDB();


// --- 4. CẤU HÌNH MIDDLEWARES ---
// Cấu hình CORS phải là middleware đầu tiên để xử lý preflight requests
app.use(cors({
  origin: "*", // Cho phép tất cả các nguồn gốc
  methods: ["GET", "POST", "PUT", "DELETE"], // Cho phép các phương thức này
  allowedHeaders: ["Content-Type", "Authorization"], // Cho phép các header này
}));

// Middleware để parse JSON body
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- 5. ĐỊNH NGHĨA ROUTES API ---
// (Đặt tất cả các route của bạn ở đây)
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/posts', require('./routes/postRoutes.js')); 
app.use('/api/conversations', require('./routes/conversationRoutes.js'));
app.use('/api/messages', require('./routes/messageRoutes.js'));
app.use('/api/notifications', require('./routes/notificationRoutes.js'));


// --- 6. TẠO HTTP SERVER VÀ SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


initializeSocket(io);

app.use((req, res, next) => {
    req.io = io;
    req.getUser = getUser;
    next();
});


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // ... các sự kiện socket ...
});

// --- 7. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});