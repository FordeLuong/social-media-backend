// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');

// Route này được bảo vệ bởi middleware 'auth'
// Client phải gửi token hợp lệ mới truy cập được
router.get('/me', auth, getMe);

module.exports = router;