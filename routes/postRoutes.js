// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,      // <---
  updatePost,       // <--- Các hàm mới đã được import
  deletePost,       // <---
  likePost,
  commentOnPost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// POST /api/posts -> Tạo bài đăng mới (Cần đăng nhập)
router.route('/').post(protect, createPost);

// GET /api/posts -> Lấy tất cả bài đăng (Công khai)
router.route('/').get(getAllPosts);

// Các route liên quan đến một bài đăng cụ thể bằng ID
router
  .route('/:id')
  .get(getPostById) // GET /api/posts/:id -> Lấy 1 bài đăng (Công khai)
  .put(protect, updatePost) // PUT /api/posts/:id -> Sửa bài đăng (Chỉ chủ bài đăng)
  .delete(protect, deletePost); // DELETE /api/posts/:id -> Xóa bài đăng (Chỉ chủ bài đăng)

// PUT /api/posts/:id/like -> Like/unlike bài đăng (Cần đăng nhập)
router.route('/:id/like').put(protect, likePost);

// POST /api/posts/:id/comment -> Bình luận (Cần đăng nhập)
router.route('/:id/comment').post(protect, commentOnPost);

module.exports = router;