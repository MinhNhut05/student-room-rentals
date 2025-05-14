import axios from "axios";

const API_URL = "/api/users"; // Use proxy instead of full URL

const register = async (userData) => {
  try {
    const res = await axios.post(API_URL, userData);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Đăng nhập người dùng
const login = async (userData) => {
  const response = await axios.post(API_URL + "/login", userData);
  return response.data; // thường trả về token
};

// Lấy profile người dùng (cần token xác thực)
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "/profile", config);
  return response.data;
};

const userService = {
  register,
  login,
  getProfile,
};

export default userService;
