const Room = require("../models/roomModel");
const mongoose = require("mongoose");

exports.createRoom = async (req, res) => {
  const room = await Room.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(room);
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

exports.getRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    // Debug database connection
    console.log("🔌 Database Status:", mongoose.connection.readyState);
    console.log("📊 Database Name:", mongoose.connection.name);

    // Log requested ID
    console.log("🔍 Requested ID:", id);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid room ID format" });
    }

    // Debug: Log all rooms first
    const allRooms = await Room.find({}).lean();
    console.log("📚 Total rooms in collection:", allRooms.length);

    // Find specific room with proper ObjectId conversion
    const room = await Room.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).lean();

    console.log("🏠 Found room:", room);

    if (!room) {
      console.log("❌ No room found with ID:", id);
      return res.status(404).json({
        message: "Room not found",
        debug: {
          requestedId: id,
          totalRooms: allRooms.length,
          availableIds: allRooms.map((r) => r._id),
        },
      });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("🔥 Error:", {
      message: error.message,
      stack: error.stack,
      connectionState: mongoose.connection.readyState,
    });
    res.status(500).json({
      message: "Server error",
      error: error.message,
      debug: {
        databaseStatus: mongoose.connection.readyState,
        databaseName: mongoose.connection.name,
      },
    });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    console.log(`📋 Found ${rooms.length} rooms`);
    res.json(rooms);
  } catch (error) {
    console.error("❌ Error getting rooms:", error);
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (room.createdBy.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not allowed to edit this room" });
  }

  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedRoom);
};

exports.deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (room.createdBy.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this room" });
  }

  await room.remove();
  res.json({ message: "Room deleted" });
};
