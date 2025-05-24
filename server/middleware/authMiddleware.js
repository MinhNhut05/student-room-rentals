const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Protect middleware to verify JWT tokens
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Debug the incoming authorization header
  console.log("Authorization header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Log the token (without exposing full value)
      console.log("Token received:", token.substring(0, 15) + "...");

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token user ID:", decoded.id);

      // Get user from token (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      console.log("User set in request:", req.user._id);

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
