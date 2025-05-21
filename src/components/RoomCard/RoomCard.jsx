import React from "react";
import { Link } from "react-router-dom";
import "./RoomCard.scss";

const RoomCard = ({ room }) => {
  const { _id, title, price, address, city, district, area, images } = room;

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

  return (
    <div className="room-card">
      <Link to={`/rooms/${_id}`} className="room-card-link">
        <div className="room-card-image-container">
          <img
            src={displayImage}
            alt={title || "Phòng trọ"}
            className="room-card-image"
          />
          <div className="room-card-price-overlay">
            <span className="price-icon">$</span>
            <span>
              {price ? price.toLocaleString("vi-VN") : "N/A"} VNĐ/tháng
            </span>
          </div>
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
        </div>
      </Link>
    </div>
  );
};

export default RoomCard;
