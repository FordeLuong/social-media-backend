// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

// API upload 1 ảnh
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
