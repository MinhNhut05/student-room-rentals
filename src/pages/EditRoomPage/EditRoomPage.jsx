import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "./EditRoomPage.scss";

const EditRoomPage = () => {
  const { id: roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [fileNames, setFileNames] = useState("Chưa có tệp mới nào được chọn");

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchRoom = async () => {
      try {
        setFetchLoading(true);
        const roomData = await roomService.getRoomById(roomId);

        // --- SỬA LẠI ĐIỀU KIỆN KIỂM TRA QUYỀN ---
        // Chỉ chuyển hướng nếu người dùng KHÔNG PHẢI chủ phòng VÀ cũng KHÔNG PHẢI là Admin
        if (
          roomData.owner._id.toString() !== user._id.toString() &&
          !user.isAdmin
        ) {
          alert("Bạn không có quyền sửa phòng trọ này.");
          navigate("/my-rooms");
          return;
        }

        setTitle(roomData.title || "");
        setDescription(roomData.description || "");
        setPrice(roomData.price?.toString() || "");
        setAddress(roomData.address || "");
        setCity(roomData.city || "");
        setDistrict(roomData.district || "");
        setArea(roomData.area?.toString() || "");
        setBedrooms(roomData.bedrooms?.toString() || "");
        setBathrooms(roomData.bathrooms?.toString() || "");
        setExistingImages(roomData.images || []);
      } catch (err) {
        setFetchError("Không thể tải dữ liệu phòng");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, user, navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + files.length > 10) {
      setSubmitError("Tổng số ảnh không vượt quá 10");
      setSelectedFiles([]);
      setImagePreviews([]);
      setFileNames("Chưa có tệp mới nào được chọn");
      return;
    }

    setSubmitError(null);
    setSelectedFiles(files);
    setFileNames(
      files.length > 0
        ? `${files.length} tệp mới đã được chọn`
        : "Chưa có tệp mới nào được chọn"
    );

    const previews = files.map((file) => URL.createObjectURL(file));
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews(previews);
  };

  const handleFileButtonClick = () => {
    document.getElementById("room-images").click();
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitLoading(true);

    if (!title || !description || !price || !address || !city) {
      setSubmitError("Vui lòng nhập đủ thông tin bắt buộc");
      setSubmitLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("address", address);
    formData.append("city", city);
    if (district) formData.append("district", district);
    if (area) formData.append("area", area);
    if (bedrooms) formData.append("bedrooms", bedrooms);
    if (bathrooms) formData.append("bathrooms", bathrooms);

    formData.append("existingImages", JSON.stringify(existingImages));

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const result = await roomService.updateRoom(roomId, formData, user.token);
      setSubmitSuccess(true);
      setSelectedFiles([]);
      setImagePreviews([]);
      setExistingImages(result.images || []);

      setTimeout(() => navigate("/my-rooms"), 2000);
    } catch (err) {
      setSubmitError(err.message || "Cập nhật thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading)
    return <div className="loader">Đang tải thông tin phòng...</div>;
  if (fetchError) return <div className="error-message">{fetchError}</div>;

  return (
    <div className="dark-theme-container">
      {/* Floating gradient shapes */}
      <div className="profile-bg-shape shape-1"></div>
      <div className="profile-bg-shape shape-2"></div>
      <div className="profile-bg-shape shape-3"></div>
      <div className="profile-bg-shape shape-4"></div>
      <div className="profile-bg-shape shape-5"></div>
      <div className="profile-bg-shape shape-6"></div>

      <div className="form-page-wrapper">
        <div className="form-header">
          <h1>CHỈNH SỬA THÔNG TIN PHÒNG TRỌ</h1>
          <p>Cập nhật chi tiết phòng trọ để thu hút nhiều người thuê hơn</p>
        </div>

        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && (
          <div className="success-message">Cập nhật thành công!</div>
        )}

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

          {existingImages.length > 0 && (
            <div className="existing-images-section">
              <label className="file-upload-label">Ảnh hiện có:</label>
              <div className="existing-images-grid">
                {existingImages.map((url, i) => (
                  <div key={i} className="existing-image-container">
                    <img
                      src={url}
                      alt={`existing-${i}`}
                      className="existing-image"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveExistingImage(url)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-field-group">
            <label htmlFor="room-images" className="file-upload-label">
              Chọn thêm ảnh phòng (Còn lại {10 - existingImages.length} ảnh)
            </label>
            <div className="custom-file-upload">
              <input
                type="file"
                id="room-images"
                multiple
                accept="image/*"
                className="native-file-input"
                onChange={handleFileChange}
                disabled={existingImages.length >= 10}
              />
              <button
                type="button"
                className="file-upload-button"
                onClick={handleFileButtonClick}
                disabled={existingImages.length >= 10}
              >
                <span className="icon-placeholder">📁</span> Chọn Tệp
              </button>
              <span className="file-upload-text">{fileNames}</span>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="new-images-preview">
              <label className="file-upload-label">Ảnh mới đã chọn:</label>
              <div className="existing-images-grid">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="existing-image-container">
                    <img
                      src={url}
                      alt={`preview-${i}`}
                      className="existing-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={submitLoading}
            >
              {submitLoading ? "ĐANG XỬ LÝ..." : "CẬP NHẬT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomPage;
