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

const userService = {
  register,
  login,
  getProfile,
  updateProfile,
};

export default userService;
