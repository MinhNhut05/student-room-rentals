import api from "./api";

const roomService = {
  getRooms: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add non-empty filters to the query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const query = queryParams.toString();
      console.log("API call with filters:", filters); // Debug log
      console.log("Query string:", query); // Debug log

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

  // Create a review for a room
  createRoomReview: async (roomId, reviewData, token) => {
    try {
      // Cấu hình để gửi kèm token xác thực
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Gửi request POST đến đúng endpoint
      const { data } = await api.post(
        `/rooms/${roomId}/reviews`,
        reviewData,
        config
      );

      return data;
    } catch (error) {
      console.error("Error creating room review:", error);
      throw error;
    }
  },

  // Hàm mới để chủ phòng gửi trả lời cho một đánh giá
  addReviewReply: async (reviewId, replyData, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Gửi request POST đến API trả lời review
      const result = await api.post(
        `/reviews/${reviewId}/replies`, // Chú ý: API này là /api/reviews/
        replyData,
        config
      );

      return result; // Không cần .data vì interceptor đã xử lý
    } catch (error) {
      console.error("Error adding review reply:", error);
      throw error;
    }
  },

  // Hàm lấy tất cả review (chỉ Admin)
  getAllReviews: async (token) => {
    try {
      console.log(
        "Service: Bắt đầu gọi API getAllReviews với token:",
        token?.substring(0, 20) + "..."
      );
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = await api.get("/reviews", config);
      console.log("Service: API response data:", data);
      return data; // Không cần .data vì interceptor đã xử lý
    } catch (error) {
      console.error("Service: Lỗi trong getAllReviews:", error);
      throw error;
    }
  },

  // Hàm xóa review (chỉ Admin)
  deleteReview: async (reviewId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const result = await api.delete(`/reviews/${reviewId}`, config);
    return result; // Không cần .data vì interceptor đã xử lý
  },
};

export default roomService;
