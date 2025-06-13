const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

// Import admin controller functions
const { getDashboardStats } = require("../controllers/adminController");

// Route cho admin dashboard stats
router.route("/stats").get(protect, admin, getDashboardStats);

module.exports = router;
