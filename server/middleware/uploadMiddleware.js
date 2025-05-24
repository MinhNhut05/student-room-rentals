const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình Cloudinary Storage cho Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "student-room-rentals",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
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
const uploadImages = (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res
        .status(400)
        .json({ message: `Lỗi tải lên ảnh: ${err.message}` });
    }

    // Log successful uploads
    console.log("Upload successful:", req.files?.length || 0, "files received");
    if (req.files?.length > 0) {
      console.log("First file details:", {
        path: req.files[0].path,
        filename: req.files[0].filename,
        originalname: req.files[0].originalname,
      });
    }

    next();
  });
};

module.exports = { uploadImages };
