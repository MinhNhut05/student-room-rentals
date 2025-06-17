import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import RoomCard from "../../components/common/RoomCard/RoomCard"; // Tái sử dụng RoomCard component
import "./MyFavoritesPage.scss"; // Tạo file style riêng nếu cần

const MyFavoritesPage = () => {
  const { user } = useAuth();
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("1. Bắt đầu chạy useEffect, kiểm tra user...");

    // Chỉ fetch dữ liệu khi có thông tin người dùng và token
    if (user && user.token) {
      console.log("2. User đã đăng nhập, bắt đầu gọi API...");

      const fetchFavorites = async () => {
        try {
          setLoading(true);
          // Gọi API lấy danh sách yêu thích từ service
          const data = await userService.getMyFavorites(user.token);

          console.log("3. API TRẢ VỀ DỮ LIỆU:", data); // <-- Dòng quan trọng nhất!

          // Filter out null/undefined rooms and ensure data integrity
          const validRooms =
            Array.isArray(data) && data.length > 0
              ? data.filter((room) => room && room._id)
              : [];

          console.log("4. Dữ liệu đã được lọc:", validRooms);

          setFavoriteRooms(validRooms); // Cập nhật state với dữ liệu đã được validate
        } catch (err) {
          console.error("5. API GẶP LỖI:", err); // <-- Xem lỗi là gì
          setError("Không thể tải danh sách yêu thích.");
          setFavoriteRooms([]); // Set empty array on error
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    } else {
      console.log("2. User chưa đăng nhập, không gọi API.");
      // Nếu không có user, không cần tải gì cả
      setLoading(false);
    }
  }, [user]); // Chạy lại khi user thay đổi (đăng nhập/đăng xuất)

  if (loading) {
    return (
      <div className="my-favorites-page">
        <div className="loader-container">
          <p>Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-favorites-page">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-favorites-page">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-heart"></i>
          Danh sách phòng yêu thích
        </h1>
        <p className="page-subtitle">
          {favoriteRooms.length} phòng trọ đã được lưu
        </p>
      </div>

      {favoriteRooms.length > 0 ? (
        <div className="room-list-grid">
          {favoriteRooms
            .filter((room) => room && room._id) // Extra safety check before rendering
            .map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                isInitiallySaved={true} // <-- Tất cả phòng ở đây đều đã được yêu thích
              />
            ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <i className="far fa-heart empty-icon"></i>
          <h3>Chưa có phòng trọ yêu thích nào</h3>
          <p>Hãy khám phá và lưu những phòng trọ bạn thích!</p>
          <a href="/rooms" className="browse-btn">
            Khám phá phòng trọ
          </a>
        </div>
      )}
    </div>
  );
};

export default MyFavoritesPage;
