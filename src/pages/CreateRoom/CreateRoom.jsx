import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import roomService from "../../services/roomService";
import "./CreateRoom.scss";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await roomService.createRoom(formData);
      navigate("/rooms");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-room-form">
      <h2>Đăng phòng mới</h2>
      {/* Basic fields */}
      <input
        type="text"
        placeholder="Tiêu đề"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Giá"
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Địa chỉ"
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      {/* Image URLs */}
      <input
        type="text"
        placeholder="URL hình ảnh (phân cách bằng dấu phẩy)"
        onChange={(e) =>
          setFormData({
            ...formData,
            images: e.target.value.split(",").map((url) => url.trim()),
          })
        }
      />
      <textarea
        placeholder="Mô tả"
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
      />
      <button type="submit">Đăng phòng</button>
    </form>
  );
};

export default CreateRoom;
