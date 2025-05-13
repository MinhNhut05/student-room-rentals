const Room = require('../models/roomModel');

exports.createRoom = async (req, res) => {
  const room = await Room.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json(room);
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

exports.getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
};

exports.updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (room.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not allowed to edit this room' });
  }

  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedRoom);
};

exports.deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (room.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not allowed to delete this room' });
  }

  await room.remove();
  res.json({ message: 'Room deleted' });
};
