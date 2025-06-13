const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Favorite = require("../models/favoriteModel"); // <-- Thêm dòng này
const Room = require("../models/roomModel"); // <-- Thêm dòng này
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

/**
 * @desc    Thêm một phòng vào danh sách yêu thích
 * @route   POST /api/users/favorites
 * @access  Private
 */
const addToFavorites = asyncHandler(async (req, res) => {
  const { roomId } = req.body;
  const userId = req.user._id;

  // Kiểm tra xem phòng có tồn tại không
  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error("Không tìm thấy phòng trọ");
  }

  // Kiểm tra xem đã yêu thích phòng này chưa
  const alreadyFavorited = await Favorite.findOne({
    user: userId,
    room: roomId,
  });
  if (alreadyFavorited) {
    // Nếu đã thích rồi thì không báo lỗi, chỉ trả về thành công
    return res
      .status(200)
      .json({ message: "Phòng đã có trong danh sách yêu thích" });
  }

  // Tạo một mục yêu thích mới
  const favorite = new Favorite({
    user: userId,
    room: roomId,
  });

  await favorite.save();
  res.status(201).json({ message: "Đã thêm vào danh sách yêu thích" });
});

/**
 * @desc    Xóa một phòng khỏi danh sách yêu thích
 * @route   DELETE /api/users/favorites/:roomId
 * @access  Private
 */
const removeFromFavorites = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  // Tìm và xóa mục yêu thích
  const result = await Favorite.findOneAndDelete({
    user: userId,
    room: roomId,
  });

  if (!result) {
    res.status(404);
    throw new Error(
      "Không tìm thấy phòng này trong danh sách yêu thích của bạn"
    );
  }

  res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích" });
});

/**
 * @desc    Lấy danh sách các phòng yêu thích của người dùng
 * @route   GET /api/users/favorites
 * @access  Private
 */
const getMyFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Tìm tất cả các mục yêu thích của user và populate thông tin chi tiết của phòng
    const favorites = await Favorite.find({ user: userId }).populate({
      path: "room",
      populate: {
        path: "owner", // populate owner information
        select: "name",
      },
    });

    // Filter out favorites where room is null (room has been deleted)
    const validFavorites = favorites.filter((fav) => fav.room !== null);

    // Remove orphaned favorite records (where room is null)
    const orphanedFavorites = favorites.filter((fav) => fav.room === null);
    if (orphanedFavorites.length > 0) {
      const orphanedIds = orphanedFavorites.map((fav) => fav._id);
      await Favorite.deleteMany({ _id: { $in: orphanedIds } });
    }

    // Trả về một mảng chỉ chứa thông tin các phòng đã được populate và valid
    const favoriteRooms = validFavorites.map((fav) => fav.room);

    res.status(200).json(favoriteRooms);
  } catch (error) {
    console.error("Error in getMyFavorites:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách yêu thích" });
  }
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

/**
 * @desc    Xóa một người dùng (chỉ Admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  // Lấy ID của user cần xóa từ URL params
  const userToDelete = await User.findById(req.params.id);

  if (userToDelete) {
    // Kiểm tra để admin không thể tự xóa chính mình
    if (req.user._id.toString() === userToDelete._id.toString()) {
      res.status(400);
      throw new Error("Bạn không thể xóa tài khoản của chính mình");
    }

    // Tìm và xóa user
    await User.deleteOne({ _id: userToDelete._id });
    res.json({ message: "Người dùng đã được xóa thành công" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

/**
 * @desc    Lấy thông tin một người dùng theo ID (chỉ Admin)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  // Tìm user theo ID, không lấy trường password
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

/**
 * @desc    Cập nhật thông tin người dùng (chỉ Admin)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Cập nhật các trường được gửi lên từ request body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // Kiểm tra isAdmin có được gửi lên không để cho phép cập nhật cả giá trị false
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin;
    }

    const updatedUser = await user.save();

    // Trả về thông tin user đã cập nhật (không có password)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

module.exports = {
  registerUser,
  authUser,
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  getMyFavorites,
  getUsers,
  getUserById, // <-- Thêm vào
  updateUser, // <-- Thêm vào
  deleteUser,
};
