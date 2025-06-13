const mongoose = require("mongoose");

// ---- Định nghĩa cấu trúc cho một Lượt Yêu thích ----
const favoriteSchema = mongoose.Schema(
  {
    // Liên kết đến người dùng đã nhấn "thích"
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    // Liên kết đến phòng trọ được "thích"
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// ---- Thêm ràng buộc UNIQUE ----
// Dòng này đảm bảo rằng cặp (user, room) là duy nhất.
// Tức là một người dùng không thể "thích" cùng một phòng 2 lần.
favoriteSchema.index({ user: 1, room: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
