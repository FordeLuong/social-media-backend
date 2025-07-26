const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { // Người nhận thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: { // Người gây ra thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: { // Loại thông báo
        type: String,
        enum: ['like', 'comment', 'follow'],
        required: true,
    },
    post: { // (Tùy chọn) Bài đăng liên quan đến thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    read: { // Trạng thái đã đọc hay chưa
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;