import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import MyRoomCard from "../../components/common/MyRoomCard/MyRoomCard";
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

        const res = await roomService.getMyRooms(user.token);
        const roomsData = res.data || res;

        if (Array.isArray(roomsData)) {
          setMyRooms(roomsData);
        } else {
          setMyRooms([]);
        }
      } catch (err) {
        setError("Không thể tải danh sách phòng trọ của bạn");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRooms();
  }, [user, navigate]);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin đăng này không?"))
      return;
    try {
      setDeletingId(roomId);
      await roomService.deleteRoom(roomId, user.token);
      setMyRooms(myRooms.filter((room) => room._id !== roomId));
    } catch (err) {
      setError("Không thể xóa tin đăng phòng trọ");
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="my-rooms-page">
      <div className="container">
        <div className="page-header">
          <h1>Phòng trọ của tôi</h1>
          <Link to="/post-room" className="post-new-room-link">
            + Đăng tin phòng trọ mới
          </Link>
        </div>

        {loading ? (
          <div className="loader-container">
            <p>Đang tải danh sách phòng của bạn...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : myRooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <p>Bạn chưa có tin đăng phòng trọ nào.</p>
            <Link to="/post-room" className="btn-add">
              Đăng tin ngay
            </Link>
          </div>
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
    </div>
  );
};

export default MyRoomsPage;
