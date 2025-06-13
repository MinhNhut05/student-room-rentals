import api from "./api"; // Dùng lại axios instance chung từ file api.js

/**
 * @desc    Lấy dữ liệu thống kê cho Dashboard
 * @param   {string} token - Token của Admin
 * @returns {Promise<Object>} - Dữ liệu thống kê
 */
const getDashboardStats = async (token) => {
  // Cấu hình request, đính kèm token để xác thực
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Gọi đến API backend đã tạo
  const data = await api.get("/admin/stats", config);
  return data;
};

const adminService = {
  getDashboardStats,
};

export default adminService;
