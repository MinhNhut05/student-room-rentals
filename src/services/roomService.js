import axios from "axios";

// Ensure the API_URL has a trailing slash
const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/rooms/` // Added trailing slash
  : "/api/rooms/"; // Added trailing slash

// Get all rooms with filters
const getRooms = async (filters = {}) => {
  // Destructure the filter object
  const { ownerId, token, ...otherFilters } = filters;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      params: {
        // Key must be "owner" to match backend's req.query.owner
        ...(ownerId && { owner: ownerId }),
        ...otherFilters,
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
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

/**
 * Create new room
 * @param {Object} roomData - Room information from the frontend form
 * @param {string} [token] - Authentication token (if not provided, will try to get from localStorage)
 * @returns {Promise} - The created room data
 */
// Tạo phòng mới (POST /api/rooms)
const createRoom = async (formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // KHÔNG cần set 'Content-Type' khi dùng FormData!
    },
  };
  try {
    const response = await axios.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Cập nhật phòng (PUT /api/rooms/:id)
const updateRoom = async (id, formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    // Now we can safely concatenate the ID directly
    const response = await axios.put(API_URL + id, formData, config);
    return response.data;
  } catch (error) {
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
