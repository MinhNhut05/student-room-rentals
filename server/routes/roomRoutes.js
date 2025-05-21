const express = require("express");
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadImages,
  uploadErrorHandler,
} = require("../middleware/uploadMiddleware");

// Combine routes with the same path
router.route("/").get(getRooms).post(
  protect,
  uploadImages, // Xử lý file upload từ form-data, tạo req.files
  uploadErrorHandler, // Bắt lỗi upload
  createRoom
);

router
  .route("/:id")
  .get(getRoomById)
  .put(protect, uploadImages, uploadErrorHandler, updateRoom)
  .delete(protect, deleteRoom);

module.exports = router;
