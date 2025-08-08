// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// --- CẤU HÌNH ---
dotenv.config();
const app = express();

// --- CẤU HÌNH CORS ---

const corsOptions = { origin: '*' }; // Cho phép tất cả nguồn gốc truy cập
app.use(cors(corsOptions));
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

const server = http.createServer(app);

// 3. Khởi tạo Socket.IO server, gắn nó vào HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép kết nối từ mọi nguồn
    methods: ["GET", "POST"]
  }
});

// 4. Lắng nghe sự kiện kết nối từ client
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Lắng nghe sự kiện "send_message" từ client
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    // Gửi lại tin nhắn cho TẤT CẢ client đang kết nối
    // (Đây là cách đơn giản nhất, sau này sẽ cải tiến)
    socket.broadcast.emit("receive_message", data);
  });

  // Lắng nghe sự kiện "disconnect"
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// --- ĐỊNH NGHĨA ROUTES ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Sử dụng authRoutes cho các đường dẫn bắt đầu bằng /api/auth
app.use('/api/auth', require('./routes/authRoutes.js'));

// Sử dụng userRoutes cho các đường dẫn bắt đầu bằng /api/users
app.use('/api/users', require('./routes/userRoutes.js'));

// Sử dụng postRoutes cho các đường dẫn bắt đầu bằng /api/posts
app.use('/api/posts', require('./routes/postRoutes.js')); 

// Sử dụng conversationRoutes và messageRoutes
app.use('/api/conversations', require('./routes/conversationRoutes.js'));
app.use('/api/messages', require('./routes/messageRoutes.js'));

// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});