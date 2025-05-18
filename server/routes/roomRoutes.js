const express = require("express");
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom, // Controller tạo phòng
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

// Combine routes with the same path
router.route("/").get(getRooms).post(protect, createRoom);

router
  .route("/:id")
  .get(getRoomById)
  .put(protect, updateRoom)
  .delete(protect, deleteRoom);

module.exports = router;
