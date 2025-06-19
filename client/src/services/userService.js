import api from "./api"; // Quan trọng: Import axios instance đã được cấu hình
import authHeader from "../utils/authHeader"; // Import tiện ích lấy header

// Đăng ký user
const register = (userData) => {
  return api.post("/auth/register", userData);
};

// Đăng nhập user
const login = (userData) => {
  return api.post("/auth/login", userData);
};

// Lấy thông tin profile
const getProfile = () => {
  return api.get("/users/profile", { headers: authHeader() });
};

// Cập nhật profile
const updateProfile = (data) => {
  return api.put("/users/profile", data, { headers: authHeader() });
};

// Hàm thêm phòng vào danh sách yêu thích
const addToFavorites = (roomId) => {
  return api.post("/users/favorites", { roomId }, { headers: authHeader() });
};

// Hàm xóa phòng khỏi danh sách yêu thích
const removeFromFavorites = (roomId) => {
  return api.delete(`/users/favorites/${roomId}`, { headers: authHeader() });
};

// Hàm lấy tất cả các phòng yêu thích của người dùng
const getMyFavorites = () => {
  return api.get("/users/favorites", { headers: authHeader() });
};

// Hàm lấy tất cả người dùng (chỉ Admin)
const getAllUsers = () => {
  return api.get("/users", { headers: authHeader() });
};

// Hàm xóa người dùng theo ID (chỉ Admin)
const deleteUser = (id) => {
  return api.delete(`/users/${id}`, { headers: authHeader() });
};

// Hàm lấy thông tin một user theo ID (chỉ Admin)
const getUserById = (id) => {
  return api.get(`/users/${id}`, { headers: authHeader() });
};

// Hàm cập nhật thông tin user (chỉ Admin)
const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData, { headers: authHeader() });
};

const userService = {
  register,
  login,
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  getMyFavorites,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
};

export default userService;
