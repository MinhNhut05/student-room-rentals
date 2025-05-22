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
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    views: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchMyRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        // Update to pass filters as an object - this is the key fix
        const roomsData = await roomService.getRooms({
          ownerId: user._id,
          token: user.token,
        });
        setMyRooms(roomsData);

        // Calculate stats
        const active = roomsData.filter(
          (room) => room.status === "active"
        ).length;
        const pending = roomsData.filter(
          (room) => room.status === "pending"
        ).length;
        const totalViews = roomsData.reduce(
          (sum, room) => sum + (room.viewCount || 0),
          0
        );

        setStats({
          total: roomsData.length,
          active,
          pending,
          views: totalViews,
        });
      } catch (err) {
        setError("Không thể tải danh sách phòng trọ của bạn.");
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

      // Update stats after deletion
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        // You would need to check the status of the deleted room to accurately update these
        // This is simplified for now
        active: prev.active - 1,
      }));
    } catch (err) {
      setError("Không thể xóa tin đăng phòng trọ.");
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="200px"
              width="200px"
              viewBox="0 0 200 200"
              className="pencil"
            >
              <defs>
                <clipPath id="pencil-eraser">
                  <rect height="30" width="30" ry="5" rx="5"></rect>
                </clipPath>
              </defs>
              <circle
                transform="rotate(-113,100,100)"
                strokeLinecap="round"
                strokeDashoffset="439.82"
                strokeDasharray="439.82 439.82"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                r="70"
                className="pencil__stroke"
              ></circle>
              <g transform="translate(100,100)" className="pencil__rotate">
                <g fill="none">
                  <circle
                    transform="rotate(-90)"
                    strokeDashoffset="402"
                    strokeDasharray="402.12 402.12"
                    strokeWidth="30"
                    stroke="#ffd43b"
                    r="64"
                    className="pencil__body1"
                  ></circle>
                  <circle
                    transform="rotate(-90)"
                    strokeDashoffset="465"
                    strokeDasharray="464.96 464.96"
                    strokeWidth="10"
                    stroke="#e96fff"
                    r="74"
                    className="pencil__body2"
                  ></circle>
                  <circle
                    transform="rotate(-90)"
                    strokeDashoffset="339"
                    strokeDasharray="339.29 339.29"
                    strokeWidth="10"
                    stroke="#4dc9ff"
                    r="54"
                    className="pencil__body3"
                  ></circle>
                </g>
                <g
                  transform="rotate(-90) translate(49,0)"
                  className="pencil__eraser"
                >
                  <g className="pencil__eraser-skew">
                    <rect
                      height="30"
                      width="30"
                      ry="5"
                      rx="5"
                      fill="#e96fff"
                    ></rect>
                    <rect
                      clipPath="url(#pencil-eraser)"
                      height="30"
                      width="5"
                      fill="#c44dff"
                    ></rect>
                    <rect height="20" width="30" fill="#f0f0f0"></rect>
                    <rect height="20" width="15" fill="#ddd"></rect>
                    <rect height="20" width="5" fill="#eee"></rect>
                    <rect
                      height="2"
                      width="30"
                      y="6"
                      fill="rgba(0,0,0,0.2)"
                    ></rect>
                    <rect
                      height="2"
                      width="30"
                      y="13"
                      fill="rgba(0,0,0,0.2)"
                    ></rect>
                  </g>
                </g>
                <g
                  transform="rotate(-90) translate(49,-30)"
                  className="pencil__point"
                >
                  <polygon points="15 0,30 30,0 30" fill="#ffd43b"></polygon>
                  <polygon points="15 0,6 30,0 30" fill="#e6be36"></polygon>
                  <polygon points="15 0,20 10,10 10" fill="#232323"></polygon>
                </g>
              </g>
            </svg>
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
          <>
            <div className="my-rooms-stats">
              <div className="stat-item">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Tổng phòng</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.active}</div>
                <div className="stat-label">Đang hoạt động</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Chờ duyệt</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.views}</div>
                <div className="stat-label">Lượt xem</div>
              </div>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
};

export default MyRoomsPage;
