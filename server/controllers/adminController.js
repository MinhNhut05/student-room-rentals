const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const Review = require("../models/reviewModel");

/**
 * @desc    Lấy dữ liệu thống kê cho Dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Đếm tổng số người dùng
    const totalUsers = await User.countDocuments();

    // Đếm tổng số phòng trọ
    const totalRooms = await Room.countDocuments();

    // Đếm tổng số đánh giá
    const totalReviews = await Review.countDocuments();

    // Trả về dữ liệu thống kê
    res.json({
      users: totalUsers,
      rooms: totalRooms,
      reviews: totalReviews,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Không thể lấy dữ liệu thống kê");
  }
});

module.exports = {
  getDashboardStats,
};
