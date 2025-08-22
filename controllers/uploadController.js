// controllers/uploadController.js
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được upload" });
    }

    // Trả về đường dẫn file (client dùng để hiển thị)
    res.json({
      message: "Upload thành công!",
      fileName: req.file.filename,
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi upload ảnh", error: error.message });
  }
};
