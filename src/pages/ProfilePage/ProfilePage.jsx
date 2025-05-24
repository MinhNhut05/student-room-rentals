import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const { user, updateUserInContext } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Lấy thông tin profile từ backend khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile(user.token);
        setProfile(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (err) {
        setError("Không thể tải thông tin cá nhân.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) {
      fetchProfile();
    }
  }, [user]);

  // Xử lý form thay đổi
  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  // Lưu cập nhật
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await userService.updateProfile(form, user.token);
      setProfile(updated);
      setEditMode(false);
      setSuccess(true);

      // Cập nhật luôn info ở context
      const updatedUser = {
        ...user,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      };
      updateUserInContext(updatedUser);
    } catch (err) {
      setError("Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-page">
      {/* Floating gradient shapes (bên ngoài container) */}
      <div className="profile-bg-shape shape-1"></div>
      <div className="profile-bg-shape shape-2"></div>
      <div className="profile-bg-shape shape-3"></div>

      <div className="profile-container">
        {/* Sticker hoặc floating icon */}

        <h1>Thông tin cá nhân</h1>
        {success && <div className="success-message">Cập nhật thành công!</div>}

        {!editMode ? (
          <div className="profile-info">
            <div className="profile-avatar">
              <img
                src={
                  profile?.avatar ||
                  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses-green-hair_23-2149436201.jpg?ga=GA1.1.1684504587.1744996293&semt=ais_hybrid&w=740"
                }
                alt="Ảnh đại diện"
                className="avatar"
              />
            </div>

            <div className="info-group">
              <label>Họ tên:</label>
              <p>{profile?.name || "Chưa cập nhật"}</p>
            </div>

            <div className="info-group">
              <label>Email:</label>
              <p>{profile?.email || "Chưa cập nhật"}</p>
            </div>

            <div className="info-group">
              <label>Điện thoại:</label>
              <p>{profile?.phone || "Chưa cập nhật"}</p>
            </div>

            <hr className="divider" />
            <h3 className="section-heading">Thông tin tài khoản</h3>

            <div className="info-group">
              <label>Ngày đăng ký:</label>
              <p>
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Chưa có thông tin"}
              </p>
            </div>

            <button onClick={() => setEditMode(true)} className="edit-btn">
              <i className="fas fa-pen-to-square"></i> Chỉnh sửa
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email của bạn"
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số điện thoại liên hệ"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                <i className="fas fa-times"></i> Hủy
              </button>

              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;