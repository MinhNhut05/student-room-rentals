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

  // Amenities state
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

  // Handle amenity toggle
  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prev) => ({ ...prev, [name]: checked }));
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

      // Add amenities
      Object.entries(amenities).forEach(([key, value]) => {
        if (value) formData.append(`amenities[${key}]`, "true");
      });

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
      setAmenities((prev) =>
        Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
      );

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
                Chia sẻ thông tin chi tiết về phòng trọ của bạn để tiếp cận
                người thuê tiềm năng
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">Đăng tin thành công!</div>
            )}

            <form className="post-room-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3 className="section-heading">Thông tin cơ bản</h3>

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
                    <span className="icon-placeholder">
                      <i className="fas fa-heading"></i>
                    </span>
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
                    <span className="icon-placeholder">
                      <i className="fas fa-money-bill-wave"></i>
                    </span>
                  </div>
                </div>

                <div className="form-field-group">
                  <div className="input-with-icon">
                    <textarea
                      id="description"
                      placeholder="Mô tả chi tiết về phòng trọ *"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="5"
                      required
                    ></textarea>
                    <span className="icon-placeholder">
                      <i className="fas fa-align-left"></i>
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-heading">Địa chỉ</h3>

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
                    <span className="icon-placeholder">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
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
                      <span className="icon-placeholder">
                        <i className="fas fa-city"></i>
                      </span>
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
                      <span className="icon-placeholder">
                        <i className="fas fa-map"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-heading">Thông tin phòng</h3>

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
                      <span className="icon-placeholder">
                        <i className="fas fa-ruler-combined"></i>
                      </span>
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
                      <span className="icon-placeholder">
                        <i className="fas fa-bed"></i>
                      </span>
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
                      <span className="icon-placeholder">
                        <i className="fas fa-shower"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="amenities-container">
                  <h3>
                    Tiện nghi có sẵn{" "}
                    <span className="info-tooltip">
                      <i className="fas fa-info-circle tooltip-icon"></i>
                      <span className="tooltip-text">
                        Những tiện nghi này sẽ giúp phòng trọ của bạn hấp dẫn
                        hơn với người thuê
                      </span>
                    </span>
                  </h3>
                  <div className="amenities-grid">
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="wifi"
                        name="wifi"
                        checked={amenities.wifi}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="wifi">Wi-Fi</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="air_conditioner"
                        name="air_conditioner"
                        checked={amenities.air_conditioner}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="air_conditioner">Máy lạnh</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="washing_machine"
                        name="washing_machine"
                        checked={amenities.washing_machine}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="washing_machine">Máy giặt</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="fridge"
                        name="fridge"
                        checked={amenities.fridge}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="fridge">Tủ lạnh</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="parking"
                        name="parking"
                        checked={amenities.parking}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="parking">Chỗ để xe</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="security"
                        name="security"
                        checked={amenities.security}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="security">Bảo vệ</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="private_bathroom"
                        name="private_bathroom"
                        checked={amenities.private_bathroom}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="private_bathroom">WC riêng</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="kitchen"
                        name="kitchen"
                        checked={amenities.kitchen}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="kitchen">Nhà bếp</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="window"
                        name="window"
                        checked={amenities.window}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="window">Cửa sổ</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="balcony"
                        name="balcony"
                        checked={amenities.balcony}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="balcony">Ban công</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="water_heater"
                        name="water_heater"
                        checked={amenities.water_heater}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="water_heater">Máy nước nóng</label>
                    </div>
                    <div className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id="tv"
                        name="tv"
                        checked={amenities.tv}
                        onChange={handleAmenityChange}
                      />
                      <label htmlFor="tv">TV</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-heading">Hình ảnh</h3>

                <div className="form-field-group">
                  <label htmlFor="room-images" className="file-upload-label">
                    Chọn ảnh phòng (Tối đa 10 ảnh)
                    <span className="info-tooltip">
                      <i className="fas fa-info-circle tooltip-icon"></i>
                      <span className="tooltip-text">
                        Hình ảnh chất lượng cao giúp thu hút nhiều lượt xem hơn
                      </span>
                    </span>
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
                      <i className="fas fa-upload"></i> Chọn Tệp
                    </button>
                    <span className="file-upload-text">{fileNames}</span>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="image-previews">
                      {selectedFiles.map((file, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(file)}
                          alt={`preview-${i}`}
                          className="preview-image"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> ĐANG XỬ LÝ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> ĐĂNG TIN NGAY
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

  );
};

export default PostRoomPage;
