const express = require("express");
const router = express.Router();
const { registerUser, authUser } = require("../controllers/userController");

// POST /api/users - Register a new user
router.post("/", registerUser);

// POST /api/users/login - Authenticate user & get token
router.post("/login", authUser);

module.exports = router;
