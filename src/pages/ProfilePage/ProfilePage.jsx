import React, { useState, useEffect } from "react";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        {!isEditing ? (
          <div className="profile-info">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt="Profile"
              className="avatar"
            />
            <div className="info-group">
              <label>Name:</label>
              <p>{profile.name}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{profile.email}</p>
            </div>
            <div className="info-group">
              <label>Phone:</label>
              <p>{profile.phone}</p>
            </div>
            <button onClick={handleEdit} className="edit-btn">
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
