const express = require("express");
const router = express.Router();

// Import controller và middleware
const {
  addReviewReply,
  getAllReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/authMiddleware");

// Route cho Admin lấy tất cả review
router.route("/").get(protect, admin, getAllReviews); // GET /api/reviews

// Route cho Admin xóa một review theo ID
router.route("/:id").delete(protect, admin, deleteReview); // DELETE /api/reviews/:id

// Route cho chủ phòng trả lời review (giữ nguyên)
router.route("/:id/replies").post(protect, addReviewReply);

module.exports = router;
