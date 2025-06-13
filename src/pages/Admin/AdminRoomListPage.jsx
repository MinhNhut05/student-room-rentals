import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "./UserListPage.scss"; // Tái sử dụng style từ UserListPage

const AdminRoomListPage = () => {
  const { user: adminUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const data = await roomService.getRooms();
        setRooms(data);
      } catch (err) {
        setError("Không thể tải danh sách phòng trọ.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllRooms();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await roomService.deleteRoom(id, adminUser.token);
        setRooms(rooms.filter((room) => room._id !== id));
        alert("Xóa phòng thành công");
      } catch (err) {
        alert(
          "Xóa phòng thất bại: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  if (loading) return <p>Đang tải danh sách phòng...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-user-list-page">
      <h1>Quản lý Phòng trọ ({rooms.length})</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Chủ phòng</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room._id}</td>
              <td>
                <Link
                  to={`/rooms/${room._id}`}
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  {room.title}
                </Link>
              </td>
              <td>{room.owner?.name || room.createdBy?.name || "N/A"}</td>
              <td>{room.price.toLocaleString("vi-VN")} VNĐ</td>
              <td>
                <span className={`status-${room.status || "active"}`}>
                  {room.status === "pending"
                    ? "Chờ duyệt"
                    : room.status === "rejected"
                    ? "Từ chối"
                    : "Hoạt động"}
                </span>
              </td>
              <td className="actions">
                <Link to={`/edit-room/${room._id}`} className="btn-edit">
                  Sửa
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => deleteHandler(room._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoomListPage;
