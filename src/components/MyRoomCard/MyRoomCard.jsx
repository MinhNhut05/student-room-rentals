import React from "react";
import { Link } from "react-router-dom";
import "./MyRoomCard.scss";

const MyRoomCard = ({ room, onDelete, isDeleting }) => {
  const { _id, title, price, address, city, images } = room;
  const defaultImage =
    "https://via.placeholder.com/300x200?text=No+Image+Available";

  return (
    <div className="my-room-card">
      <Link to={`/rooms/${_id}`} className="my-room-card-image-link">
        <div className="my-room-card-image">
          <img
            src={images && images.length > 0 ? images[0] : defaultImage}
            alt={title}
          />
        </div>
      </Link>
      <div className="my-room-card-info">
        <Link to={`/rooms/${_id}`} className="my-room-card-title-link">
          <h3>{title}</h3>
        </Link>
        <p>{price?.toLocaleString("vi-VN")} VNĐ</p>
        <p>
          {address}, {city}
        </p>
      </div>
      <div className="my-room-card-actions">
        <Link to={`/edit-room/${_id}`} className="btn btn-edit">
          Sửa
        </Link>
        <button
          className="btn btn-delete"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </div>
  );
};

export default MyRoomCard;
