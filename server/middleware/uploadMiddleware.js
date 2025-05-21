const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình Cloudinary Storage cho Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "student-room-rentals",
    format: async (req, file) => "png", // Hoặc dùng file.mimetype.split('/')[1] nếu muốn giữ định dạng gốc
    public_id: (req, file) =>
      `room-${Date.now()}-${file.originalname.replace(/\s/g, "_")}`,
  },
});

// Lọc chỉ nhận file ảnh
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Chỉ cho phép tải lên file ảnh (jpeg, png, gif, webp)!"),
      false
    );
  }
};

// Cấu hình Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
    files: 10, // Tối đa 10 ảnh
  },
});

// Middleware upload nhiều file (tối đa 10) với field name là 'images'
const uploadImages = upload.array("images", 10);

// Middleware xử lý lỗi upload
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Lỗi Multer như quá số lượng file, file quá lớn
    return res.status(400).json({ message: `Lỗi tải lên ảnh: ${err.message}` });
  } else if (err) {
    // Các lỗi khác
    return res.status(400).json({ message: `Lỗi tải lên ảnh: ${err.message}` });
  }
  next();
};

module.exports = { uploadImages, uploadErrorHandler };
