const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Middleware xác thực JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization có Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user và gán vào req.user
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Token không hợp lệ");
    }
  } else {
    res.status(401);
    throw new Error("Không có token xác thực");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Không có quyền truy cập, yêu cầu quyền Admin");
  }
};

module.exports = { protect, admin };
