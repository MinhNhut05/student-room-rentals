const mongoose = require("mongoose");

// --- Định nghĩa cấu trúc cho một Trả lời (Reply) của chủ phòng ---
const replySchema = mongoose.Schema(
  {
    name: {
      // Tên của chủ phòng
      type: String,
      required: true,
    },
    comment: {
      // Nội dung trả lời
      type: String,
      required: true,
    },
    user: {
      // ID của chủ phòng
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ---- Cập nhật lại cấu trúc cho một Đánh giá (Review) ----
const reviewSchema = mongoose.Schema(
  {
    // Tên của người dùng viết đánh giá, dùng để hiển thị nhanh
    name: {
      type: String,
      required: true,
    },

    // Điểm đánh giá (ví dụ: từ 1 đến 5 sao)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Nội dung bình luận chi tiết
    comment: {
      type: String,
      required: true,
    },

    // Liên kết đến người dùng đã viết đánh giá (tham chiếu đến User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // 'User' là tên model bạn đã đăng ký cho người dùng
    },

    // Liên kết đến phòng trọ được đánh giá (tham chiếu đến Room model)
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room", // 'Room' là tên model bạn đã đăng ký cho phòng trọ
    },

    // --- TRƯỜNG MỚI THÊM VÀO ---
    // Một mảng để chứa tất cả các câu trả lời cho đánh giá này
    replies: [replySchema],
  },
  {
    // Tự động thêm hai trường: createdAt và updatedAt
    timestamps: true,
  }
);

// Tạo Model 'Review' từ Schema đã định nghĩa
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
