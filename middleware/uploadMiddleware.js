// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ thêm dòng này

// Thiết lập engine lưu trữ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // đi ra ngoài 1 cấp vì middleware/ nằm ngang hàng với public/
    const dir = path.join(__dirname, '..', 'public', 'uploads'); 

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // tự tạo folder nếu chưa có
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  },
});

// Kiểm tra loại file
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Chỉ cho phép upload ảnh!'));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

module.exports = upload;
