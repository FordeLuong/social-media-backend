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
  createPostWithImage
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware'); // Import middleware upload để xử lý file ảnh

// Các route liên quan đến bài đăng
// GET /api/posts -> Lấy tất cả bài đăng (Công khai)
// POST /api/posts -> Tạo bài đăng mới (Cần đăng nhập)

router
  .route('/')
  .get(getAllPosts)
  .post(auth, createPost);

router.route('/image').post(auth, upload.single('image'), createPostWithImage);
// Các route liên quan đến một bài đăng cụ thể bằng ID
router
  .route('/:id')
  .get(getPostById) // GET /api/posts/:id -> Lấy 1 bài đăng (Công khai)
  .put(auth, updatePost) // PUT /api/posts/:id -> Sửa bài đăng (Chỉ chủ bài đăng)
  .delete(auth, deletePost); // DELETE /api/posts/:id -> Xóa bài đăng (Chỉ chủ bài đăng)

// PUT /api/posts/:id/like -> Like/unlike bài đăng (Cần đăng nhập)
router.route('/:id/like').put(auth, likePost);

// POST /api/posts/:id/comment -> Bình luận (Cần đăng nhập)
router.route('/:id/comment').post(auth, commentOnPost);

module.exports = router;