// socket.js

// Danh sách người dùng đang online
// Cấu trúc: [{ userId: '...', socketId: '...' }]
let onlineUsers = [];

const addUser = (userId, socketId) => {
    // Chỉ thêm nếu user chưa tồn tại trong danh sách
    !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
};

// Hàm chính để khởi tạo và quản lý các sự kiện socket
const initializeSocket = (io) => {

    io.on('connection', (socket) => {
        console.log('Một người dùng đã kết nối:', socket.id);

        // --- Xử lý User Online ---
        // Lắng nghe sự kiện từ client khi họ kết nối
        socket.on('addUser', (userId) => {
            addUser(userId, socket.id);
            // Gửi lại danh sách user đang online cho tất cả client
            io.emit('getUsers', onlineUsers);
            console.log('Online users:', onlineUsers);
        });
        
        // --- Xử lý Tin nhắn ---
        socket.on('send_message', ({ senderId, receiverId, text, conversationId }) => {
            const receiver = getUser(receiverId);
            if (receiver) {
                // Chỉ gửi đến socket của người nhận
                io.to(receiver.socketId).emit('receive_message', {
                    sender: senderId,
                    text,
                    conversationId,
                    createdAt: new Date(),
                });
            }
        });
        
        // --- Xử lý Thông báo ---
        // Bạn có thể tạo sự kiện riêng cho notification
        // Ví dụ: server sẽ emit sự kiện này từ controller
        
        // --- Xử lý Disconnect ---
        socket.on('disconnect', () => {
            console.log('Một người dùng đã ngắt kết nối', socket.id);
            removeUser(socket.id);
            io.emit('getUsers', onlineUsers);
        });
    });
};

// Export hàm khởi tạo và các hàm tiện ích khác nếu cần
module.exports = { 
    initializeSocket, 
    getUser // Export hàm này để controller có thể tìm socketId
};