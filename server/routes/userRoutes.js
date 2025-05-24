const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/users - Register a new user
router.post("/", registerUser);

// POST /api/users/login - Authenticate user & get token
router.post("/login", authUser);

// User profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;