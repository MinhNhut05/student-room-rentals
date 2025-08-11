import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import "./UserEditPage.scss";

const UserEditPage = () => {
  const { id: userId } = useParams(); // Lấy userId từ URL
  const navigate = useNavigate();
  const { user: adminUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(userId, adminUser.token);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, adminUser.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userData = { name, email, isAdmin };
      await userService.updateUser(userId, userData, adminUser.token);
      alert("Cập nhật người dùng thành công!");
      navigate("/admin/users"); // Quay về trang danh sách
    } catch (err) {
      alert(
        "Cập nhật thất bại: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-user-edit-page">
        <div className="loader-container">
          <div className="sk-folding-cube" aria-label="loading">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-user-edit-page">
        <p className="error-message">{error}</p>
        <Link to="/admin/users" className="back-link">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-user-edit-page">
      <div className="page-header">
        <Link to="/admin/users" className="back-link">
          <i className="fas fa-arrow-left"></i> Quay lại danh sách
        </Link>
        <h1>Sửa thông tin Người dùng</h1>
      </div>

      <div className="edit-form-container">
        <form onSubmit={submitHandler} className="user-edit-form">
          <div className="form-group">
            <label htmlFor="name">Tên người dùng</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor="isAdmin">Quyền Admin</label>
            </div>
            <small className="help-text">
              Người dùng có quyền Admin có thể quản lý tất cả người dùng và nội
              dung
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/users")}
              disabled={saving}
            >
              Hủy
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Đang cập nhật..." : "Cập nhật người dùng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
