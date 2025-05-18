import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "../PostRoomPage/PostRoomPage.scss"; // Reuse style nếu thích
import "./EditRoomPage.scss"; // Additional styles specific to edit page

const EditRoomPage = () => {
  const { id: roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State cho input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [images, setImages] = useState([""]);

  // Trạng thái fetch
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  // Trạng thái submit
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchRoom = async () => {
      try {
        setFetchLoading(true);
        const roomData = await roomService.getRoomById(roomId);
        console.log("roomData:", roomData);

        // Kiểm tra quyền sở hữu
        if (roomData.owner._id.toString() !== user._id.toString()) {
          console.log("Access denied: Not the owner of this room");
          console.log(
            "Room owner:",
            roomData.owner._id,
            "Current user:",
            user._id
          );
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
        setImages(
          roomData.images && roomData.images.length > 0 ? roomData.images : [""]
        );
      } catch (err) {
        setFetchError("Không thể tải dữ liệu phòng!");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, user, navigate]);

  // Xử lý submit update phòng
  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setSubmitLoading(true);

    if (!title || !description || !price || !address || !city) {
      setSubmitError("Vui lòng nhập đủ thông tin bắt buộc!");
      setSubmitLoading(false);
      return;
    }

    const updatedRoom = {
      title,
      description,
      price: parseFloat(price),
      address,
      city,
      district,
      area: area ? parseFloat(area) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      images: images.filter((url) => url.trim() !== ""),
    };
    try {
      await roomService.updateRoom(roomId, updatedRoom, user.token);
      setSubmitSuccess(true);
      // Tùy chọn: điều hướng sau vài giây
      setTimeout(() => navigate("/my-rooms"), 1000);
    } catch (err) {
      setSubmitError(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Hàm xử lý ảnh
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };
  const handleAddImageInput = () => {
    if (images[images.length - 1].trim() !== "") setImages([...images, ""]);
  };
  const handleRemoveImageInput = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.length ? newImages : [""]);
  };

  if (fetchLoading) return <p>Đang tải thông tin phòng...</p>;
  if (fetchError) return <p className="error-message">{fetchError}</p>;

  return (
    <div className="edit-room-page post-room-page auth-page">
      <h1>Chỉnh sửa tin đăng</h1>
      {submitError && <p className="error-message">{submitError}</p>}
      {submitSuccess && <p className="success-message">Cập nhật thành công!</p>}
      <form onSubmit={submitHandler}>
        {/* Các trường giống form đăng tin */}
        <div className="form-group">
          <label>
            Tiêu đề <span className="required">*</span>:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            Mô tả <span className="required">*</span>:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>
            Giá (VNĐ/tháng) <span className="required">*</span>:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>
            Địa chỉ chi tiết <span className="required">*</span>:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            Tỉnh/Thành phố <span className="required">*</span>:
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Quận/Huyện:</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Diện tích (m²):</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Số phòng ngủ:</label>
          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Số phòng tắm:</label>
          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            min="0"
          />
        </div>
        {/* Nhập URL ảnh */}
        <div className="form-group">
          <label>URL Ảnh:</label>
          {images.map((url, idx) => (
            <div key={idx} className="image-input-group">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder={`URL Ảnh ${idx + 1}`}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImageInput(idx)}
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
          {images[images.length - 1].trim() !== "" && (
            <button
              type="button"
              className="add-image-btn"
              onClick={handleAddImageInput}
            >
              + Thêm ảnh
            </button>
          )}
        </div>
        <button type="submit" disabled={submitLoading}>
          {submitLoading ? "Đang cập nhật..." : "Cập nhật tin đăng"}
        </button>
      </form>
    </div>
  );
};

export default EditRoomPage;
