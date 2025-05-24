import api from "./api";

const roomService = {
  getRooms: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add non-empty filters to the query
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const query = queryParams.toString();
      // Don't include /api since it's already in the base URL
      return await api.get(`/rooms${query ? `?${query}` : ""}`);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },

  getRoomById: async (id) => {
    // Don't include /api since it's already in the base URL
    return await api.get(`/rooms/${id}`);
  },

  createRoom: async (roomData, token) => {
    try {
      // Ensure roomData is FormData
      if (!(roomData instanceof FormData)) {
        console.error(
          "Error: roomData must be a FormData instance, not a plain object!"
        );
        throw new Error("Invalid data format: FormData required");
      }

      console.log("Creating room with token:", token?.substring(0, 10) + "...");

      // Don't include /api since it's already in the base URL
      return await api.post("/rooms", roomData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT manually set Content-Type - let axios handle it for FormData
        },
      });
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  },

  updateRoom: async (id, roomData, token) => {
    try {
      // Ensure roomData is FormData (similar to createRoom)
      let formData = roomData;
      if (!(roomData instanceof FormData)) {
        formData = new FormData();

        // Add basic fields
        Object.entries(roomData).forEach(([key, value]) => {
          if (key !== "images" && key !== "amenities") {
            formData.append(key, value);
          }
        });

        // Add amenities
        if (roomData.amenities) {
          Object.entries(roomData.amenities).forEach(([key, value]) => {
            formData.append(`amenities[${key}]`, value);
          });
        }

        // Add images
        if (roomData.images && Array.isArray(roomData.images)) {
          roomData.images.forEach((file) => {
            formData.append("images", file);
          });
        }
      }

      console.log("Updating room with FormData:", formData);

      return await api.put(`/rooms/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let axios handle Content-Type for FormData
        },
      });
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  deleteRoom: async (id, token) => {
    try {
      console.log(
        `Deleting room ${id} with token: ${token?.substring(0, 10)}...`
      );

      // Don't include /api since it's already in the base URL
      return await api.delete(`/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  },

  // Get user's rooms
  getMyRooms: async (token) => {
    // Do not pass any parameters, just the token
    return await api.get("/rooms/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default roomService;
