import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import MyRoomCard from "../../components/MyRoomCard/MyRoomCard"; // Bước sau sẽ tạo component này
import "./MyRoomsPage.scss";

const MyRoomsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchMyRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const roomsData = await roomService.getRooms(user._id, user.token);
        setMyRooms(roomsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyRooms();
  }, [user, navigate]);

  // Xử lý xóa phòng
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin đăng này không?"))
      return;
    try {
      setDeletingId(roomId);
      await roomService.deleteRoom(roomId, user.token);
      setMyRooms(myRooms.filter((room) => room._id !== roomId));
    } catch (err) {
      setError(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="my-rooms-page">
      <h1>Phòng trọ của tôi</h1>
      <Link to="/post-room" className="post-new-room-link">
        + Đăng tin phòng trọ mới
      </Link>
      {loading ? (
        <p>Đang tải danh sách phòng...</p>
      ) : error ? (
        <p className="error-message">Lỗi: {error}</p>
      ) : myRooms.length === 0 ? (
        <p>Bạn chưa có tin đăng phòng trọ nào.</p>
      ) : (
        <div className="my-room-list-grid">
          {myRooms.map((room) => (
            <MyRoomCard
              key={room._id}
              room={room}
              onDelete={() => handleDeleteRoom(room._id)}
              isDeleting={deletingId === room._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoomsPage;
