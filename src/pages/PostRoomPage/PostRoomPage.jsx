import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "./PostRoomPage.scss";

const PostRoomPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState("Chưa có tệp nào được chọn");

  const [amenities, setAmenities] = useState({
    wifi: false,
    air_conditioner: false,
    washing_machine: false,
    fridge: false,
    parking: false,
    security: false,
    private_bathroom: false,
    kitchen: false,
    window: false,
    balcony: false,
    water_heater: false,
    tv: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError("Bạn chỉ được chọn tối đa 10 ảnh");
      return;
    }

    setSelectedFiles(files);
    setFileNames(
      files.length > 0
        ? `${files.length} tệp đã được chọn`
        : "Chưa có tệp nào được chọn"
    );
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileButtonClick = () => {
    document.getElementById("room-images").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!title || !description || !price || !address || !city) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("district", district || "");
      formData.append("area", area || "");
      formData.append("bedrooms", bedrooms || "");
      formData.append("bathrooms", bathrooms || "");

      Object.entries(amenities).forEach(([key, value]) => {
        if (value) formData.append(`amenities[${key}]`, "true");
      });

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      await roomService.createRoom(formData, user.token);
      setSuccess(true);

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setAddress("");
      setCity("");
      setDistrict("");
      setArea("");
      setBedrooms("");
      setBathrooms("");
      setSelectedFiles([]);
      setFileNames("Chưa có tệp nào được chọn");
      setAmenities((prev) =>
        Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
      );

      setTimeout(() => {
        navigate("/my-rooms");
      }, 2000);
    } catch (err) {
      setError(err.message || "Đăng tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dark-theme-container">
      <div className="form-page-wrapper">
        <div className="form-header">
          <h1>ĐĂNG TIN PHÒNG TRỌ</h1>
          <p>Đăng tin cho thuê phòng trọ nhanh chóng và hiệu quả</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Đăng tin thành công!</div>}

        <form className="post-room-form" onSubmit={handleSubmit}>
          <div className="form-field-group">
            <label>Tiêu đề tin đăng *</label>
            <input
              type="text"
              placeholder="VD: Phòng trọ gần ĐH Bách Khoa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <label>Giá thuê (VNĐ/tháng) *</label>
              <input
                type="number"
                placeholder="VD: 2500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-field-group">
              <label>Diện tích (m²)</label>
              <input
                type="number"
                placeholder="VD: 25"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Mô tả chi tiết *</label>
            <textarea
              placeholder="Mô tả về phòng trọ, tiện ích xung quanh..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="form-field-group">
            <label>Địa chỉ *</label>
            <input
              type="text"
              placeholder="Số nhà, tên đường"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <label>Tỉnh/Thành phố *</label>
              <input
                type="text"
                placeholder="VD: Hồ Chí Minh"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-field-group">
              <label>Quận/Huyện</label>
              <input
                type="text"
                placeholder="VD: Quận 1"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <label>Số phòng ngủ</label>
              <input
                type="number"
                placeholder="VD: 1"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
            <div className="form-field-group">
              <label>Số phòng tắm</label>
              <input
                type="number"
                placeholder="VD: 1"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Ảnh phòng trọ (tối đa 10 ảnh)</label>
            <div className="custom-file-upload">
              <input
                type="file"
                id="room-images"
                multiple
                accept="image/*"
                className="native-file-input"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="file-upload-button"
                onClick={handleFileButtonClick}
              >
                Chọn ảnh
              </button>
              <span className="file-upload-text">{fileNames}</span>
            </div>
          </div>

          <div className="amenities-container">
            <h3>Tiện nghi</h3>
            <div className="amenities-grid">
              {Object.keys(amenities).map((key) => (
                <div key={key} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={amenities[key]}
                    onChange={handleAmenityChange}
                  />
                  <label htmlFor={key}>
                    {key === "wifi" && "Wi-Fi"}
                    {key === "air_conditioner" && "Máy lạnh"}
                    {key === "washing_machine" && "Máy giặt"}
                    {key === "fridge" && "Tủ lạnh"}
                    {key === "parking" && "Chỗ để xe"}
                    {key === "security" && "Bảo vệ"}
                    {key === "private_bathroom" && "WC riêng"}
                    {key === "kitchen" && "Nhà bếp"}
                    {key === "window" && "Cửa sổ"}
                    {key === "balcony" && "Ban công"}
                    {key === "water_heater" && "Máy nước nóng"}
                    {key === "tv" && "TV"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRoomPage;
