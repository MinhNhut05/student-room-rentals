const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// Đăng ký user mới
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Kiểm tra email đã tồn tại
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email đã được sử dụng");
  }

  // Tạo user mới
  const user = await User.create({ name, email, password, phone });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Dữ liệu user không hợp lệ");
  }
});

// Đăng nhập user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Email hoặc mật khẩu không đúng");
  }
});

// Lấy thông tin profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy user");
  }

  res.json(user);
});

// Cập nhật profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy user");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

module.exports = { registerUser, authUser, getProfile, updateProfile };
