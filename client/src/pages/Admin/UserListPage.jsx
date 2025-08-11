import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <-- Add Link import
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import "./UserListPage.scss"; // Tạo file này để thêm style

const UserListPage = () => {
  const { user: adminUser } = useAuth(); // Lấy thông tin admin đang đăng nhập

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Hàm để gọi API
    const fetchUsers = async () => {
      try {
        // Dùng token của admin để gọi API
        const data = await userService.getAllUsers(adminUser.token);
        setUsers(data);
      } catch (err) {
        setError(
          "Không thể tải danh sách người dùng. Bạn có phải là Admin không?"
        );
      } finally {
        setLoading(false);
      }
    };

    // Nếu admin đã đăng nhập thì mới gọi API
    if (adminUser && adminUser.token) {
      fetchUsers();
    }
  }, [adminUser]);

  // Hàm xử lý khi nhấn nút xóa
  const deleteHandler = async (id) => {
    // Hiển thị hộp thoại xác nhận để tránh xóa nhầm
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await userService.deleteUser(id, adminUser.token);
        // Cập nhật lại danh sách users trên giao diện mà không cần tải lại trang
        setUsers(users.filter((user) => user._id !== id));
        alert("Xóa người dùng thành công");
      } catch (err) {
        alert(
          "Xóa người dùng thất bại: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  if (loading) return (
    <div className="loader-container">
      <div className="sk-folding-cube" aria-label="loading">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
      <p>Đang tải danh sách người dùng...</p>
    </div>
  );
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-user-list-page">
      <h1>Quản lý Người dùng ({users.length})</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>
                {user.isAdmin ? (
                  <span className="status-admin">Có</span>
                ) : (
                  <span className="status-user">Không</span>
                )}
              </td>
              <td className="actions">
                <Link to={`/admin/users/${user._id}/edit`} className="btn-edit">
                  Sửa
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => deleteHandler(user._id)}
                  // Vô hiệu hóa nút xóa nếu đó là tài khoản admin đang đăng nhập
                  disabled={adminUser._id === user._id}
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

export default UserListPage;
