const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const mongoose = require("mongoose");

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const { owner } = req.query;
  let query = {};
  if (owner) query.owner = owner;
  const rooms = await Room.find(query).populate("owner", "name email phone");
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
  const { title, description, price, address, city, ...rest } = req.body;
  const ownerId = req.user._id;

  if (!title || !description || !price || !address || !city) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ các trường bắt buộc");
  }

  if (price <= 0) {
    res.status(400);
    throw new Error("Giá phòng phải lớn hơn 0");
  }

  const room = new Room({
    owner: ownerId,
    title,
    description,
    price,
    address,
    city,
    ...rest,
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  // Kiểm tra quyền sở hữu
  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to update this room");
  }
  // Chỉ cập nhật các trường gửi lên
  const fields = [
    "title",
    "description",
    "price",
    "address",
    "city",
    "district",
    "area",
    "bedrooms",
    "bathrooms",
    "images",
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) room[field] = req.body[field];
  });
  const updatedRoom = await room.save();
  res.json(updatedRoom);
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
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
