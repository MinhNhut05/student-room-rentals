import api from "./api"; // Quan trọng: Import axios instance đã được cấu hình
import authHeader from "../utils/authHeader"; // Import tiện ích lấy header

// --- AUTH SERVICES ---
// Sử dụng endpoint /users/ cho đăng ký và đăng nhập theo cấu trúc mới
const register = (userData) => {
  return api.post("/users/register", userData);
};

const login = (userData) => {
  // Đảm bảo gọi đến /users/login
  return api.post("/users/login", userData);
};

// --- USER PROFILE SERVICES ---
// Các endpoint này đều thuộc /users/
const getProfile = () => {
  return api.get("/users/profile", { headers: authHeader() });
};

const updateProfile = (data) => {
  return api.put("/users/profile", data, { headers: authHeader() });
};

// --- FAVORITES SERVICES ---
const addToFavorites = (roomId) => {
  return api.post("/users/favorites", { roomId }, { headers: authHeader() });
};

const removeFromFavorites = (roomId) => {
  return api.delete(`/users/favorites/${roomId}`, { headers: authHeader() });
};

const getMyFavorites = () => {
  return api.get("/users/favorites", { headers: authHeader() });
};

// --- ADMIN SERVICES ---
const getAllUsers = () => {
  return api.get("/users", { headers: authHeader() });
};

const deleteUser = (id) => {
  return api.delete(`/users/${id}`, { headers: authHeader() });
};

const getUserById = (id) => {
  return api.get(`/users/${id}`, { headers: authHeader() });
};

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
