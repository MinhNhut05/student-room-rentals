import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import roomService from "../../services/roomService";
import "./RoomDetailPage.scss";

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const data = await roomService.getRoomById(id);
        setRoom(data);
      } catch (err) {
        setError("Không thể tải thông tin phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  if (loading) return <p>Đang tải chi tiết phòng...</p>;
  if (error) return <p>{error}</p>;
  if (!room) return <p>Không tìm thấy phòng.</p>;

  return (
    <div className="room-detail-page">
      <h2>{room.title}</h2>

      {room.images && room.images.length > 0 ? (
        <div className="image-grid">
          {room.images.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Ảnh ${index + 1}`}
              className="room-image"
            />
          ))}
        </div>
      ) : (
        <div className="room-detail-image">
          <img
            src="https://via.placeholder.com/600x400?text=No+Image"
            alt="No image available"
          />
        </div>
      )}

      <p>
        <strong>Giá:</strong> {room.price.toLocaleString("vi-VN")} VNĐ
      </p>
      <p>
        <strong>Địa chỉ:</strong> {room.location}
      </p>
      <p>
        <strong>Mô tả:</strong> {room.description}
      </p>
    </div>
  );
};

export default RoomDetailPage;
