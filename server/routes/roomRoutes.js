const express = require("express");
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getAllRooms,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");
const Room = require("../models/roomModel");

const router = express.Router();

// Public routes
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Protected routes
router.post("/", protect, createRoom);
router.put("/:id", protect, updateRoom);
router.delete("/:id", protect, deleteRoom);

module.exports = router;
