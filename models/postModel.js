const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        index: true // Tạo chỉ mục để tìm kiếm nhanh hơn
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
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['like', 'love', 'haha', 'sad', 'angry'], // Các loại biểu cảm
            required: true
            }
    }], 
    comments: [{ // Mảng các bình luận của bài đăng
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
}, {
    timestamps: true,
    default:[]
});
postSchema.index({ content: 'text' }, { default_language: 'none' });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;