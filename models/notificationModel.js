const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { // Người nhận thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    sender: { // Người gây ra thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: { // Loại thông báo
        type: String,
        enum: ['like', 'comment', 'follow', 'message'],
        required: true,
    },
    post: { // (Tùy chọn) Bài đăng liên quan đến thông báo
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    comment: { //Thêm reference đến comment nếu type = 'comment'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    message: { // Custom message cho notification
        type: String,
        maxlength: 200
    },
    read: { // Trạng thái đã đọc hay chưa
        type: Boolean,
        default: false,
        index: true,
    },
    readAt: { // Thời gian đã đọc
        type: Date,
        default: null,  
    }
}, {
    timestamps: true
});

// Compound index để query efficient hơn
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

// Method để mark as read
notificationSchema.methods.markAsRead = function() {
    this.read = true;
    this.readAt = new Date();
    return this.save();
};

// Static method để lấy unread count
notificationSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({ recipient: userId, read: false });
};

// Static method để mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
    return this.updateMany(
        { recipient: userId, read: false },
        { read: true, readAt: new Date() }
    );
};

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;