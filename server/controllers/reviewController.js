const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const Review = require("../models/reviewModel");

/**
 * @desc    Thêm một trả lời vào một đánh giá
 * @route   POST /api/reviews/:id/replies
 * @access  Private (Chỉ chủ phòng)
 */
const addReviewReply = asyncHandler(async (req, res) => {
  // Lấy nội dung trả lời từ body
  const { comment } = req.body;
  // Lấy ID của đánh giá từ URL
  const reviewId = req.params.id;

  // Tìm đánh giá mà người dùng muốn trả lời
  const review = await Review.findById(reviewId);

  if (review) {
    // Từ review, tìm ra phòng trọ tương ứng để kiểm tra chủ sở hữu
    const room = await Room.findById(review.room);

    // Kiểm tra xem người dùng đang đăng nhập có phải là chủ phòng không
    if (room.owner.toString() !== req.user._id.toString()) {
      res.status(401); // Unauthorized
      throw new Error("Chỉ chủ phòng mới có thể trả lời đánh giá này");
    }

    // Tạo đối tượng trả lời mới
    const reply = {
      name: req.user.name,
      comment,
      user: req.user._id,
    };

    // Thêm câu trả lời vào mảng replies của review
    review.replies.push(reply);

    // Lưu lại review đã được cập nhật
    await review.save();

    res.status(201).json(review); // Trả về review đã có thêm trả lời
  } else {
    res.status(404); // Not Found
    throw new Error("Không tìm thấy đánh giá");
  }
});

/**
 * @desc    Lấy tất cả đánh giá (chỉ Admin)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
const getAllReviews = asyncHandler(async (req, res) => {
  // Tìm tất cả review, populate để lấy thêm tên user và tiêu đề phòng
  const reviews = await Review.find({})
    .populate("user", "name email")
    .populate("room", "title");
  res.json(reviews);
});

/**
 * @desc    Xóa một đánh giá (chỉ Admin)
 * @route   DELETE /api/reviews/:id
 * @access  Private/Admin
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    const roomId = review.room;
    await review.deleteOne();

    // SAU KHI XÓA REVIEW, CẬP NHẬT LẠI ĐIỂM TRUNG BÌNH CỦA PHÒNG
    const room = await Room.findById(roomId);
    if (room) {
      const remainingReviews = await Review.find({ room: roomId });
      room.numReviews = remainingReviews.length;

      // Nếu vẫn còn review, tính lại điểm trung bình. Nếu không, trả về 0.
      room.rating =
        remainingReviews.length > 0
          ? remainingReviews.reduce((acc, item) => item.rating + acc, 0) /
            remainingReviews.length
          : 0;
      await room.save();
    }

    res.json({ message: "Đánh giá đã được xóa" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đánh giá");
  }
});

module.exports = {
  addReviewReply,
  getAllReviews, // <-- Thêm vào
  deleteReview, // <-- Thêm vào
};
