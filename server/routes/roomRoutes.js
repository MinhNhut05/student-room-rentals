const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getRooms).post(protect, createRoom);

router
  .route("/:id")
  .get(getRoomById)
  .put(protect, updateRoom)
  .delete(protect, deleteRoom);

module.exports = router;
