const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

// Tạo JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Đăng ký user mới
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Kiểm tra user đã tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo user mới
    const user = await User.create({ name, email, password, phone });

    // Trả về đầy đủ thông tin khi đăng ký
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký user", error: error.message });
  }
};

// Đăng nhập user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });

    // Kiểm tra user và password
    if (user && (await user.matchPassword(password))) {
      // Trả về đầy đủ thông tin user, bao gồm cả `isAdmin`
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: error.message });
  }
};
