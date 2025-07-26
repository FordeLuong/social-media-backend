const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    imageUrl: { // Dùng để lưu link ảnh/video của bài đăng
        type: String,
        default: ''
    },
    author: { // Tham chiếu đến người đăng bài
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{ // Mảng các user đã thích bài đăng này
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;