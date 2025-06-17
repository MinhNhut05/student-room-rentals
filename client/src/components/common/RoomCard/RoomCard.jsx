import React, { useState, useEffect } from "react"; // Sửa lại dòng này để có cả useEffect
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/authContext"; // <-- Thêm dòng này
import userService from "../../../services/userService"; // <-- Thêm dòng này
import "./RoomCard.scss";

const RoomCard = ({ room, isInitiallySaved = false }) => {
  const { user } = useAuth(); // <-- Thêm dòng này
  const { _id, title, price, address, city, district, area, images, owner } =
    room;

  // Dòng này sẽ khởi tạo state isSaved bằng giá trị được truyền từ cha
  const [isSaved, setIsSaved] = useState(isInitiallySaved);

  // Find the first available image or use placeholder
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  // Create a display address from available location data
  const displayAddress = [address, district ? `${district},` : "", city || ""]
    .filter(Boolean)
    .join(" ");

  // Placeholder values for missing data
  const maxOccupancy = room.maxOccupancy || "2";
  const type = room.type || "Phòng trọ";

  // Check if room is new (posted within last 3 days)
  const isNew =
    room.createdAt &&
    (new Date() - new Date(room.createdAt)) / (1000 * 60 * 60 * 24) < 3;

  // Thêm đoạn useEffect này vào trong component RoomCard
  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  // Toggle save room
  const handleSaveClick = async (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của Link, không cho chuyển trang

    // 1. Kiểm tra xem người dùng đã đăng nhập chưa
    if (!user) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    // 2. Gọi API tương ứng
    try {
      if (isSaved) {
        // Nếu đã thích -> gọi API bỏ thích
        await userService.removeFromFavorites(_id, user.token);
      } else {
        // Nếu chưa thích -> gọi API thêm vào yêu thích
        await userService.addToFavorites(_id, user.token);
      }

      // 3. Cập nhật lại giao diện nút bấm sau khi API thành công
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="room-card">
      <Link to={`/rooms/${_id}`} className="room-card-link">
        <div
          className="room-card-image-container"
          data-badge={
            room.nearbySchools ? `Gần ${room.nearbySchools} trường` : ""
          }
        >
          <img
            src={displayImage}
            alt={title || "Phòng trọ"}
            className="room-card-image"
          />
          <div className="room-card-price-overlay">
            <span className="price-icon">₫</span>
            <span>{price ? price.toLocaleString("vi-VN") : "N/A"}/tháng</span>
          </div>

          <button
            className={`save-button ${isSaved ? "saved" : ""}`}
            onClick={handleSaveClick}
            aria-label={isSaved ? "Đã lưu" : "Lưu phòng"}
          >
            {isSaved ? "♥" : "♡"}
          </button>

          {isNew && <div className="status-ribbon new">Mới</div>}
          {room.isHot && <div className="status-ribbon hot">Hot</div>}
          {room.isVerified && (
            <div className="status-ribbon verified">Xác thực</div>
          )}
        </div>

        <div className="room-card-info">
          <h3 className="room-card-title" title={title}>
            {title || "Chưa có tiêu đề"}
          </h3>

          <div className="room-card-details">
            <div className="room-card-detail-item">
              <span className="detail-icon area-icon">⊡</span>
              <span>{area || "N/A"} m²</span>
            </div>
            <div className="room-card-detail-item">
              <span className="detail-icon occupancy-icon">👥</span>
              <span>{maxOccupancy} người</span>
            </div>
            <div className="room-card-detail-item room-card-type">
              <span className="detail-icon type-icon">🛏️</span>
              <span>{type}</span>
            </div>
          </div>

          <div className="room-card-location">
            <span className="location-icon">📍</span>
            <span title={displayAddress}>
              {displayAddress || "Chưa rõ địa chỉ"}
            </span>
          </div>

          {/* --- DÒNG MỚI THÊM VÀO --- */}
          {/* Chỉ hiển thị nếu có thông tin người đăng */}
          {owner && (
            <div className="room-card-owner">
              <span className="owner-icon">👤</span>
              <span className="owner-text">
                Đăng bởi: <strong>{owner.name}</strong>
              </span>
            </div>
          )}
          {/* --- KẾT THÚC DÒNG MỚI --- */}
        </div>
      </Link>
    </div>
  );
};

export default RoomCard;
