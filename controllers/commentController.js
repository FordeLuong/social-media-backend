const Comment = require('../models/commentModel');

// @desc    Lấy các câu trả lời cho một bình luận
// @route   GET /api/comments/:commentId/replies
exports.getReplies = async (req, res) => {
    try {
        const replies = await Comment.find({ parentComment: req.params.commentId })
            .populate('author', 'username avatar')
            .sort({ createdAt: 1 });
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Chỉnh sửa một bình luận
// @route   PUT /api/comments/:commentId
exports.updateComment = async (req, res) => { 
    /* ... Logic sửa, kiểm tra author ... */ 
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Bình luận không tồn tại' });
        }
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa bình luận này' });
        }
        comment.content = req.body.content || comment.content;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Xóa một bình luận
// @route   DELETE /api/comments/:commentId
exports.deleteComment = async (req, res) => { 
    /* ... Logic xóa, kiểm tra author, xóa cả replies con ... */ 
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Bình luận không tồn tại' });
        }
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
        }
        // Xóa tất cả các replies con
        await Comment.deleteMany({ parentComment: comment._id });
        // Xóa bình luận chính
        await comment.remove();
        res.status(200).json({ message: 'Bình luận đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};