import React from "react";
import { Link } from "react-router-dom";
import "./MyRoomCard.scss";

const MyRoomCard = ({ room, onDelete, isDeleting }) => {
  const {
    _id,
    title,
    price,
    address,
    city,
    district,
    images,
    status = "active",
    viewCount = 0,
  } = room;

  // Determine status display
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Đã từ chối";
      case "expired":
        return "Đã hết hạn";
      default:
        return "Chưa xác định";
    }
  };

  // Find the first available image or use placeholder
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  // Create a display address from available location data
  const displayAddress = [address, district ? `${district},` : "", city || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="my-room-card">
      <Link to={`/rooms/${_id}`} className="my-room-card-image-link">
        <img src={displayImage} alt={title} className="my-room-card-image" />
      </Link>

      <div className="my-room-card-info">
        <h3 title={title}>{title || "Chưa có tiêu đề"}</h3>
        <p className="my-room-card-price">
          {price ? price.toLocaleString("vi-VN") : "N/A"} VNĐ/tháng
        </p>
        <p className="my-room-card-location">
          <span>📍</span> {displayAddress || "Chưa rõ địa chỉ"}
        </p>

        <div className="my-room-card-stats">
          <div className="stat-item">
            <span className="stat-icon">👁️</span> {viewCount} lượt xem
          </div>
          <div className="stat-item">
            <span className="stat-icon">📅</span>{" "}
            {room.updatedAt
              ? new Date(room.updatedAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </div>
        </div>

        <div className={`room-status status-${status}`}>
          {getStatusLabel(status)}
        </div>
      </div>

      <div className="my-room-card-actions">
        <Link to={`/rooms/${_id}`} className="btn btn-view">
          Xem
        </Link>
        <Link to={`/edit-room/${_id}`} className="btn btn-edit">
          Sửa
        </Link>
        <button
          className="btn btn-delete"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </div>
  );
};

export default MyRoomCard;