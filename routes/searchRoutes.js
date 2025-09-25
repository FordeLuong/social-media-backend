// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const  auth  = require('../middleware/auth.js');
const { searchAll } = require('../controllers/searchController');


router.use((req, res, next) => {
    console.log('--- DEBUGGING SEARCH ROUTE ---');
    console.log('Original URL:', req.originalUrl);
    console.log('Query Params:', req.query);
    console.log('----------------------------');
    next(); // Chuyển sang xử lý tiếp theo
});
// GET /api/search?q=...
router.route('/').get(auth, searchAll); 

module.exports = router;