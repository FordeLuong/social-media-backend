// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Cần cho Socket.IO
const { Server } = require('socket.io'); // Cần cho Socket.IO

// --- 1. CẤU HÌNH BAN ĐẦU ---
dotenv.config();
const app = express();

// --- 2. CẤU HÌNH MIDDLEWARES (PHẢI LÀM TRƯỚC ROUTES) ---
// Cấu hình CORS phải là middleware đầu tiên
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// Middleware để parse JSON body
app.use(express.json());

// --- 3. KẾT NỐI DATABASE ---
connectDB(); // Giữ nguyên hàm connectDB của bạn

// --- 4. ĐỊNH NGHĨA TOÀN BỘ ROUTES API ---
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/posts', require('./routes/postRoutes.js')); 
app.use('/api/conversations', require('./routes/conversationRoutes.js'));
app.use('/api/messages', require('./routes/messageRoutes.js'));

// --- 5. TẠO HTTP SERVER VÀ TÍCH HỢP SOCKET.IO ---
// Toàn bộ cấu hình của 'app' đã xong, bây giờ mới tạo server từ nó
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép kết nối socket từ mọi nguồn
    methods: ["GET", "POST"]
  }
});

// Lắng nghe các sự kiện của Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- 6. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
// Quan trọng: Phải gọi server.listen() chứ không phải app.listen()
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Hàm connectDB của bạn (giữ nguyên không đổi)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};