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
                stroke="hsl(223,90%,50%)"
                r="64"
                className="pencil__body1"
              ></circle>
              <circle
                transform="rotate(-90)"
                strokeDashoffset="465"
                strokeDasharray="464.96 464.96"
                strokeWidth="10"
                stroke="hsl(223,90%,60%)"
                r="74"
                className="pencil__body2"
              ></circle>
              <circle
                transform="rotate(-90)"
                strokeDashoffset="339"
                strokeDasharray="339.29 339.29"
                strokeWidth="10"
                stroke="hsl(223,90%,40%)"
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
                  fill="hsl(223,90%,70%)"
                ></rect>
                <rect
                  clipPath="url(#pencil-eraser)"
                  height="30"
                  width="5"
                  fill="hsl(223,90%,60%)"
                ></rect>
                <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
                <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
                <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
                <rect
                  height="2"
                  width="30"
                  y="6"
                  fill="hsla(223,10%,10%,0.2)"
                ></rect>
                <rect
                  height="2"
                  width="30"
                  y="13"
                  fill="hsla(223,10%,10%,0.2)"
                ></rect>
              </g>
            </g>
            <g
              transform="rotate(-90) translate(49,-30)"
              className="pencil__point"
            >
              <polygon
                points="15 0,30 30,0 30"
                fill="hsl(33,90%,70%)"
              ></polygon>
              <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
              <polygon
                points="15 0,20 10,10 10"
                fill="hsl(223,10%,10%)"
              ></polygon>
            </g>
          </g>
        </svg>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Thông tin cá nhân</h1>
        {success && <div className="success-message">Cập nhật thành công!</div>}

        {!editMode ? (
          <div className="profile-info">
            <div className="profile-avatar">
              <img
                src={profile?.avatar || "/default-avatar.png"}
                alt="Profile Avatar"
                className="avatar"
              />
            </div>

            <div className="info-group">
              <label>Họ tên:</label>
              <p>{profile?.name}</p>
            </div>

            <div className="info-group">
              <label>Email:</label>
              <p>{profile?.email}</p>
            </div>

            <div className="info-group">
              <label>Số điện thoại:</label>
              <p>{profile?.phone || "Chưa cập nhật"}</p>
            </div>

            <div className="info-group">
              <label>Ngày đăng ký:</label>
              <p>
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <button onClick={() => setEditMode(true)} className="edit-btn">
              Chỉnh sửa
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="edit-form">
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
