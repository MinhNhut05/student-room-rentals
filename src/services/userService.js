import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/"; // Đảm bảo đúng đường dẫn

// Đăng ký người dùng
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

// Đăng nhập người dùng
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  return response.data; // thường trả về token
};

// Lấy profile người dùng (cần token xác thực)
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "profile", config);
  return response.data;
};

const userService = {
  register,
  login,
  getProfile,
};

export default userService;
