import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "./PostRoomPage.scss";

const PostRoomPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
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

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle file selection
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

  // Trigger file input click
  const handleFileButtonClick = () => {
    document.getElementById("room-images").click();
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
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
      formData.append("district", district);
      formData.append("area", area);
      formData.append("bedrooms", bedrooms);
      formData.append("bathrooms", bathrooms);

      // Add all selected image files
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

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

      // Redirect after success
      setTimeout(() => {
        navigate("/my-rooms");
      }, 2000);
    } catch (err) {
      setError(
        err.message || "Đã xảy ra lỗi khi đăng tin. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dark-theme-container">
      <div className="form-page-wrapper">
        <div className="form-header">
          <h1>ĐĂNG TIN PHÒNG TRỌ MỚI</h1>
          <p>
            Chia sẻ thông tin chi tiết về phòng trọ của bạn để tiếp cận người
            thuê tiềm năng
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Đăng tin thành công!</div>}

        <form className="post-room-form" onSubmit={handleSubmit}>
          <div className="form-field-group">
            <div className="input-with-icon">
              <input
                type="text"
                id="title"
                placeholder="Tiêu đề tin đăng *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <span className="icon-placeholder">✎</span>
            </div>
          </div>

          <div className="form-field-group">
            <div className="input-with-icon">
              <input
                type="number"
                id="price"
                placeholder="Giá (VNĐ/tháng) *"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <span className="icon-placeholder">₫</span>
            </div>
          </div>

          <div className="form-field-group">
            <textarea
              id="description"
              placeholder="Mô tả chi tiết về phòng trọ *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <div className="input-with-icon">
                <input
                  type="text"
                  id="address"
                  placeholder="Địa chỉ chi tiết *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <span className="icon-placeholder">📍</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <div className="input-with-icon">
                <input
                  type="text"
                  id="city"
                  placeholder="Tỉnh/Thành phố *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <span className="icon-placeholder">🏙️</span>
              </div>
            </div>

            <div className="form-field-group">
              <div className="input-with-icon">
                <input
                  type="text"
                  id="district"
                  placeholder="Quận/Huyện"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
                <span className="icon-placeholder">🏘️</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field-group">
              <div className="input-with-icon">
                <input
                  type="number"
                  id="area"
                  placeholder="Diện tích (m²)"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
                <span className="icon-placeholder">📐</span>
              </div>
            </div>

            <div className="form-field-group">
              <div className="input-with-icon">
                <input
                  type="number"
                  id="bedrooms"
                  placeholder="Số phòng ngủ"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
                <span className="icon-placeholder">🛏️</span>
              </div>
            </div>

            <div className="form-field-group">
              <div className="input-with-icon">
                <input
                  type="number"
                  id="bathrooms"
                  placeholder="Số phòng tắm"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
                <span className="icon-placeholder">🚿</span>
              </div>
            </div>
          </div>

          <div className="form-field-group">
            <label htmlFor="room-images" className="file-upload-label">
              Chọn ảnh phòng (Tối đa 10 ảnh)
            </label>
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
                <span className="icon-placeholder">📁</span> Chọn Tệp
              </button>
              <span className="file-upload-text">{fileNames}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG TIN NGAY"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRoomPage;
