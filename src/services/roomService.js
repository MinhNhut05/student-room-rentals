import axios from "axios";

const API_URL = "/api/rooms/"; // This will be proxied to http://localhost:5000/api/rooms/

// Get all rooms
const getRooms = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get room by id
const getRoomById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Create new room (requires token)
const createRoom = async (roomData) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, roomData, config);
  return response.data;
};

// Update room (requires token)
const updateRoom = async (id, roomData) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id, roomData, config);
  return response.data;
};

// Delete room (requires token)
const deleteRoom = async (id) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const roomService = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;
