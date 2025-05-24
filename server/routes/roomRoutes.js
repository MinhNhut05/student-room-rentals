const express = require("express");
const router = express.Router();
const {
  getRooms,
  getMyRooms,
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

// IMPORTANT: Specific routes before parameterized routes
router.get("/my", protect, getMyRooms);

// Public routes
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Protected routes with file upload
router.post("/", protect, uploadImages, createRoom);
router.put("/:id", protect, uploadImages, updateRoom);
router.delete("/:id", protect, deleteRoom);

module.exports = router;
