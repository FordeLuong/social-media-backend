const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: { // Người viết bình luận
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: { // Bài đăng mà bình luận này thuộc về
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    parentComment: { // ID của bình luận cha (nếu đây là một câu trả lời)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null // Mặc định là null cho các bình luận cấp 1
    },
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;