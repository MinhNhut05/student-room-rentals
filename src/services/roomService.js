import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/rooms`
  : "/api/rooms";

// Get all rooms with error handling
const getRooms = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Get room by id with error handling
const getRoomById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Create new room (requires token) with error handling
const createRoom = async (roomData) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL, roomData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Update room (requires token) with error handling
const updateRoom = async (id, roomData) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(`${API_URL}/${id}`, roomData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error.response?.data?.message || error.message;
  }
};

// Delete room (requires token) with error handling
const deleteRoom = async (id) => {
  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error.response?.data?.message || error.message;
  }
};

const roomService = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;
