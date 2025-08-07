// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getMe, getUserById } = require('../controllers/userController.js');
const { getUserPosts } = require('../controllers/postController.js');
const auth = require('../middleware/auth.js');

// Route này được bảo vệ bởi middleware 'auth'
// Client phải gửi token hợp lệ mới truy cập được
router.get('/me', auth, getMe);


// Route để lấy thông tin của một user bất kỳ theo ID
// ':id' là một tham số động (dynamic parameter)
router.get('/:id', getUserById);

// Route để lấy tất cả bài đăng của một user theo ID
router.route('/:userId/posts').get(getPostsByUserId);

module.exports = router;