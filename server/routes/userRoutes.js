const express = require("express");
const router = express.Router();

const {
  registerUser,
  authUser,
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  getMyFavorites,
  getUsers, // Admin function
  getUserById, // <-- Import hàm mới
  updateUser, // <-- Import hàm mới
  deleteUser, // <-- Import hàm mới
} = require("../controllers/userController");

// Import cả 'protect' và 'admin'
const { protect, admin } = require("../middleware/authMiddleware");

// Route cho đường dẫn gốc '/api/users'
router
  .route("/")
  // GET: Lấy tất cả user - Yêu cầu đăng nhập (protect) VÀ có quyền admin (admin)
  .get(protect, admin, getUsers) // <-- Add admin route
  // POST: Đăng ký user mới - Công khai
  .post(registerUser);

// Các route khác giữ nguyên
router.post("/login", authUser);
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

// --- CÁC ROUTE CHO YÊU THÍCH ---
// GET: Lấy danh sách yêu thích | POST: Thêm một mục vào yêu thích
router
  .route("/favorites")
  .get(protect, getMyFavorites)
  .post(protect, addToFavorites);

// DELETE: Xóa một mục khỏi danh sách yêu thích dựa vào roomId
router.route("/favorites/:roomId").delete(protect, removeFromFavorites);

// Sửa lại route /:id để bao gồm cả GET và PUT
router
  .route("/:id")
  .get(protect, admin, getUserById) // Lấy chi tiết user
  .put(protect, admin, updateUser) // Cập nhật user
  .delete(protect, admin, deleteUser); // Xóa user (đã có)

module.exports = router;
