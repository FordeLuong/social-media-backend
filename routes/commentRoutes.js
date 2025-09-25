const express = require('express');
const router = express.Router();
const { getReplies, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.route('/:commentId/replies').get(getReplies);
router.route('/:commentId').put(auth, updateComment).delete(auth, deleteComment);

module.exports = router;