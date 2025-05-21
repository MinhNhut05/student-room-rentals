const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const mongoose = require("mongoose");

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const {
    keyword,
    city,
    district,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    owner,
  } = req.query;

  let findQuery = {};

  // 1. Keyword search (title, description)
  if (keyword) {
    findQuery.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }
  // 2. Lọc city, district
  if (city) findQuery.city = city;
  if (district) findQuery.district = district;

  // 3. Lọc theo giá
  let priceQuery = {};
  if (minPrice) priceQuery.$gte = parseFloat(minPrice);
  if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);
  if (Object.keys(priceQuery).length > 0) findQuery.price = priceQuery;

  // 4. Lọc diện tích
  let areaQuery = {};
  if (minArea) areaQuery.$gte = parseFloat(minArea);
  if (maxArea) areaQuery.$lte = parseFloat(maxArea);
  if (Object.keys(areaQuery).length > 0) findQuery.area = areaQuery;

  // 5. Lọc owner
  if (owner) findQuery.owner = owner;

  // Query MongoDB
  const rooms = await Room.find(findQuery).populate(
    "owner",
    "name email phone"
  );
  res.json(rooms);
});

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate(
    "owner",
    "name email _id"
  );
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  res.json(room);
});

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
const createRoom = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    district,
    area,
    bedrooms,
    bathrooms,
    location,
  } = req.body;
  const ownerId = req.user._id;

  // Lấy URLs của các ảnh đã upload (file.path chính là URL trên Cloudinary)
  const imageUrls = req.files ? req.files.map((file) => file.path) : [];

  if (!title || !description || !price || !address || !city) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ các trường bắt buộc!");
  }

  // Check price after type conversion
  if (Number(price) <= 0) {
    res.status(400);
    throw new Error("Giá phòng phải lớn hơn 0");
  }

  const room = new Room({
    owner: ownerId,
    title,
    description,
    price: Number(price), // Standard type casting
    address,
    city,
    district,
    area: area ? Number(area) : undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    bathrooms: bathrooms ? Number(bathrooms) : undefined,
    location,
    images: imageUrls,
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = asyncHandler(async (req, res) => {
  // First check if the room exists and handle 404 if needed
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Only after confirming room exists, check ownership
  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to update this room");
  }

  const {
    title,
    description,
    price,
    address,
    city,
    district,
    area,
    bedrooms,
    bathrooms,
    location,
  } = req.body;

  // Lấy các ảnh mới (file upload), mỗi file có file.path là URL
  const newImageUrls = req.files ? req.files.map((file) => file.path) : [];

  // Lấy các URL ảnh cũ còn lại được gửi lên từ frontend (chuỗi JSON hoặc mảng)
  let existingImageUrls = [];
  if (req.body.existingImages) {
    try {
      existingImageUrls = JSON.parse(req.body.existingImages);
      if (!Array.isArray(existingImageUrls)) existingImageUrls = [];
    } catch (e) {
      existingImageUrls = [];
    }
  }

  // Cập nhật các trường với type casting tiêu chuẩn
  room.title = title !== undefined ? title : room.title;
  room.description = description !== undefined ? description : room.description;
  room.price = price !== undefined ? Number(price) : room.price;
  room.address = address !== undefined ? address : room.address;
  room.city = city !== undefined ? city : room.city;
  room.district = district !== undefined ? district : room.district;
  room.area = area !== undefined ? Number(area) : room.area;
  room.bedrooms = bedrooms !== undefined ? Number(bedrooms) : room.bedrooms;
  room.bathrooms = bathrooms !== undefined ? Number(bathrooms) : room.bathrooms;
  room.location = location !== undefined ? location : room.location;

  // Gộp danh sách ảnh: ảnh cũ còn lại + ảnh mới upload
  room.images = [...existingImageUrls, ...newImageUrls];

  const updatedRoom = await room.save();
  res.json(updatedRoom);
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = asyncHandler(async (req, res) => {
  // First check if the room exists and handle 404 if needed
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  // Only after confirming room exists, check ownership
  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to delete this room");
  }
  await room.deleteOne();
  res.json({ message: "Room removed" });
});

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
