import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "development" && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL + "/api/users/"
    : "/api/users/";

// Đăng ký user
const register = async (userData) => {
  try {
    const res = await axios.post(API_URL, userData);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};

// Đăng nhập user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  return response.data;
};

// Lấy thông tin profile
const getProfile = async (token) => {
  const res = await axios.get(API_URL + "profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Cập nhật profile
const updateProfile = async (data, token) => {
  const res = await axios.put(API_URL + "profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Hàm thêm phòng vào danh sách yêu thích
const addToFavorites = async (roomId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const body = { roomId }; // Backend mong muốn nhận roomId trong body
  const { data } = await axios.post(API_URL + "favorites", body, config);
  return data;
};

// Hàm xóa phòng khỏi danh sách yêu thích
const removeFromFavorites = async (roomId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // Chú ý: roomId được truyền qua URL params
  const { data } = await axios.delete(API_URL + `favorites/${roomId}`, config);
  return data;
};

// Hàm lấy tất cả các phòng yêu thích của người dùng
const getMyFavorites = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(API_URL + "favorites", config);
  return data;
};

// Hàm lấy tất cả người dùng (chỉ Admin)
const getAllUsers = async (token) => {
  // Cấu hình để gửi kèm token của Admin
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Gửi request GET đến API lấy danh sách người dùng
  const { data } = await axios.get(API_URL, config);
  return data;
};

// Hàm xóa người dùng theo ID (chỉ Admin)
const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // Gửi request DELETE đến API
  const { data } = await axios.delete(`${API_URL}${id}`, config);
  return data;
};

// Hàm lấy thông tin một user theo ID (chỉ Admin)
const getUserById = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`${API_URL}${id}`, config);
  return data;
};

// Hàm cập nhật thông tin user (chỉ Admin)
const updateUser = async (id, userData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.put(`${API_URL}${id}`, userData, config);
  return data;
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
  getUserById, // <-- Thêm vào
  updateUser, // <-- Thêm vào
};

export default userService;
