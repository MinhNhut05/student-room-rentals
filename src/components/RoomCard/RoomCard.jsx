import React from "react";
import { Link } from "react-router-dom";
import "./RoomCard.scss";

const RoomCard = ({ room }) => {
  const { _id, title, price, location, images } = room;
  const defaultImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link to={`/rooms/${_id}`} className="room-card-link">
      <div className="room-card">
        <div className="room-card-image">
          <img src={images?.[0] || defaultImage} alt={title} />
        </div>
        <div className="room-card-info">
          <h3>{title}</h3>
          <p className="price">{price.toLocaleString("vi-VN")} VNĐ</p>
          <p className="location">{location}</p>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
