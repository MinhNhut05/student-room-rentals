// Import Cloudinary SDK phiên bản v2 (phiên bản mới nhất)
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// Import dotenv để đọc biến môi trường từ file .env
dotenv.config(); // Nạp biến môi trường

// Cấu hình Cloudinary
cloudinary.config({
  // Tên cloud (lấy từ Cloudinary dashboard)
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  // API key cho xác thực (lấy từ Cloudinary dashboard)
  api_key: process.env.CLOUDINARY_API_KEY,

  // API secret cho bảo mật (lấy từ Cloudinary dashboard)
  api_secret: process.env.CLOUDINARY_API_SECRET,

  // Sử dụng HTTPS cho tất cả URL (bảo mật)
  secure: true,
});

// Xuất instance cloudinary đã được cấu hình để sử dụng trong middleware
module.exports = cloudinary;
