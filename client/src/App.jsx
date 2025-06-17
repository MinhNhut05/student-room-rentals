import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import "./MyFavoritesPage.scss";

const MyFavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const favoriteRooms = await userService.getMyFavorites(user.token);
        setFavorites(favoriteRooms);
      } catch (err) {
        setError("Không thể tải danh sách phòng yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (roomId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa phòng này khỏi danh sách yêu thích?"
      )
    ) {
      try {
        await userService.removeFavorite(roomId, user.token);
        setFavorites(favorites.filter((room) => room._id !== roomId));
        alert("Đã xóa phòng khỏi danh sách yêu thích.");
      } catch (err) {
        alert("Không thể xóa phòng khỏi danh sách yêu thích.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p>Đang tải danh sách phòng yêu thích...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="no-favorites">
        <h2>Danh sách yêu thích</h2>
        <p>Bạn chưa có phòng nào trong danh sách yêu thích.</p>
      </div>
    );
  }

  return (
    <div className="my-favorites-page">
      <h2 className="page-title">Danh sách phòng yêu thích</h2>

      <div className="favorites-list">
        {favorites.map((room) => (
          <div key={room._id} className="room-card">
            <div className="room-image">
              <img src={room.images[0]} alt={room.title} />
            </div>
            <div className="room-info">
              <h3 className="room-title">{room.title}</h3>
              <p className="room-price">
                {room.price.toLocaleString("vi-VN")} VNĐ/tháng
              </p>
              <p className="room-address">
                {room.address}, {room.district}, {room.city}
              </p>
            </div>
            <button
              className="remove-favorite-btn"
              onClick={() => handleRemoveFavorite(room._id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
