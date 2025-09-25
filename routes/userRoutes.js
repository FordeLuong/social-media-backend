// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getMe, getUserById, followUser, unfollowUser, updateUserProfile } = require('../controllers/userController.js');
const { getUserPosts } = require('../controllers/postController.js');
const auth = require('../middleware/auth.js');
const upload = require('../middleware/uploadMiddleware'); // Import middleware upload để xử lý file ảnh


// --- CÁC ROUTE TĨNH (STATIC ROUTES) 

// @route   GET /api/users/me
// Lấy thông tin của người dùng đang đăng nhập
router.get('/me', auth, getMe);

// @route   PUT /api/users/profile
// Cập nhật thông tin profile của người dùng đang đăng nhập
router.put('/profile', auth, updateUserProfile);


// --- CÁC ROUTE ĐỘNG (DYNAMIC ROUTES)

// @route   GET /api/users/:id
// Lấy thông tin của một user bất kỳ theo ID
router.get('/:id', getUserById);

// @route   GET /api/users/:userId/posts
// Lấy tất cả bài đăng của một user theo ID
router.get('/:userId/posts', getUserPosts);

// @route   POST /api/users/:id/follow
// Theo dõi một user
router.post('/:id/follow', auth, followUser);

// @route   POST /api/users/:id/unfollow
// Bỏ theo dõi một user
router.post('/:id/unfollow', auth, unfollowUser);




module.exports = router;