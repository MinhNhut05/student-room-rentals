import React, { useEffect, useState } from "react";
import roomService from "../../services/roomService";
import RoomCard from "../../components/RoomCard/RoomCard";
import "./RoomListPage.scss";

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await roomService.getRooms();
        setRooms(data);
      } catch (err) {
        setError("Không thể tải danh sách phòng trọ.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="room-list-page">
      <h1>Danh sách phòng trọ</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rooms.length === 0 ? (
        <p>Hiện chưa có phòng trọ nào.</p>
      ) : (
        <div className="room-list-grid">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomListPage;
