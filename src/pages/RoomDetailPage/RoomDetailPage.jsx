import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "./RoomDetailPage.scss";

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const data = await roomService.getRoomById(id);
        setRoom(data);
      } catch (err) {
        setError("Không thể tải thông tin phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const openImageModal = (imgUrl, index) => {
    setSelectedImage(imgUrl);
    setCurrentImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction) => {
    if (!room || !room.images) return;

    const totalImages = room.images.length;
    let newIndex;

    if (direction === "next") {
      newIndex = (currentImageIndex + 1) % totalImages;
    } else {
      newIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(room.images[newIndex]);
  };

  const handleDeleteRoom = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng trọ này?")) {
      try {
        setDeleting(true);
        await roomService.deleteRoom(id, user.token);
        alert("Xóa phòng trọ thành công");
        navigate("/my-rooms");
      } catch (err) {
        alert("Không thể xóa phòng trọ");
      } finally {
        setDeleting(false);
      }
    }
  };

  const renderAmenities = () => {
    if (!room || !room.amenities) return null;

    const amenitiesList = [
      { key: "wifi", label: "Wi-Fi", icon: "fa-wifi" },
      { key: "air_conditioner", label: "Máy lạnh", icon: "fa-snowflake" },
      { key: "washing_machine", label: "Máy giặt", icon: "fa-washing-machine" },
      { key: "fridge", label: "Tủ lạnh", icon: "fa-refrigerator" },
      { key: "parking", label: "Chỗ để xe", icon: "fa-motorcycle" },
      { key: "security", label: "Bảo vệ", icon: "fa-shield-alt" },
      { key: "private_bathroom", label: "WC riêng", icon: "fa-toilet" },
      { key: "kitchen", label: "Nhà bếp", icon: "fa-utensils" },
      { key: "window", label: "Cửa sổ", icon: "fa-window-maximize" },
      { key: "balcony", label: "Ban công", icon: "fa-door-open" },
      { key: "water_heater", label: "Máy nước nóng", icon: "fa-hot-tub" },
      { key: "tv", label: "TV", icon: "fa-tv" },
    ];

    return (
      <div className="amenities-section fade-in">
        <h3 className="amenities-title">
          <i className="fas fa-check-circle amenities-icon"></i>
          Tiện nghi
        </h3>
        <div className="amenities-grid">
          {amenitiesList.map((item) => (
            <div
              key={item.key}
              className={`amenity-item ${
                room.amenities[item.key] ? "available" : ""
              }`}
            >
              <i className={`fas ${item.icon} amenity-icon`}></i>
              <span className="amenity-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loader-container">
        <p>Đang tải chi tiết phòng...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!room) {
    return <div className="error-message">Không tìm thấy phòng</div>;
  }

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        <h1 className="room-detail-title">{room.title}</h1>

        <div className="room-detail-main">
          <div className="room-detail-gallery fade-in">
            {room.images && room.images.length > 0 ? (
              <div className="image-grid">
                {room.images.map((imgUrl, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={imgUrl}
                      alt={`Ảnh ${index + 1}`}
                      className="room-image"
                      onClick={() => openImageModal(imgUrl, index)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="room-detail-image">
                <img
                  src="https://via.placeholder.com/600x400?text=No+Image"
                  alt="No image available"
                />
              </div>
            )}
          </div>

          <div className="room-detail-info">
            <div className="info-card fade-in">
              <div className="info-section price-section">
                <span className="detail-icon price-icon">₫</span>
                <div className="info-content">
                  <h3 className="info-title">Giá thuê</h3>
                  <p className="info-value">
                    {room.price.toLocaleString("vi-VN")} VNĐ/tháng
                  </p>
                </div>
              </div>

              <div className="info-section location-section">
                <span className="detail-icon location-icon">📍</span>
                <div className="info-content">
                  <h3 className="info-title">Địa chỉ</h3>
                  <p className="info-value">
                    {room.address}
                    {room.district ? `, ${room.district}` : ""}
                    {room.city ? `, ${room.city}` : ""}
                  </p>
                </div>
              </div>

              {room.area && (
                <div className="info-section area-section">
                  <span className="detail-icon area-icon">⊡</span>
                  <div className="info-content">
                    <h3 className="info-title">Diện tích</h3>
                    <p className="info-value">{room.area} m²</p>
                  </div>
                </div>
              )}

              {room.bedrooms && (
                <div className="info-section area-section">
                  <span className="detail-icon area-icon">
                    <i className="fas fa-bed"></i>
                  </span>
                  <div className="info-content">
                    <h3 className="info-title">Phòng ngủ</h3>
                    <p className="info-value">{room.bedrooms}</p>
                  </div>
                </div>
              )}

              {room.bathrooms && (
                <div className="info-section area-section">
                  <span className="detail-icon area-icon">
                    <i className="fas fa-bath"></i>
                  </span>
                  <div className="info-content">
                    <h3 className="info-title">Phòng tắm</h3>
                    <p className="info-value">{room.bathrooms}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="room-description-card fade-in">
              <h3 className="description-title">Mô tả chi tiết</h3>
              <div className="description-content">{room.description}</div>
            </div>
          </div>
        </div>

        {renderAmenities()}

        <div className="contact-section fade-in">
          <div className="contact-info">
            <h3 className="contact-title">Bạn quan tâm đến phòng này?</h3>
            <p className="contact-text">
              Liên hệ với chủ nhà để biết thêm thông tin và đặt lịch xem phòng
            </p>
          </div>
          <button className="contact-button">
            <i className="fas fa-phone-alt"></i> Liên hệ ngay
          </button>
        </div>

        <div className="map-section fade-in">
          <h3 className="map-title">
            <i className="fas fa-map-marker-alt map-icon"></i>
            Vị trí trên bản đồ
          </h3>
          <div className="map-container">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                [room.address, room.district, room.city]
                  .filter(Boolean)
                  .join(", ")
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              title="room-location"
            ></iframe>
          </div>
        </div>

        <button
          className="delete-room-button"
          onClick={handleDeleteRoom}
          disabled={deleting}
        >
          {deleting ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-trash"></i>
          )}
          Xóa phòng trọ
        </button>
      </div>

      {selectedImage && (
        <div className="gallery-modal" onClick={closeImageModal}>
          <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Room detail" />
            <button className="close-button" onClick={closeImageModal}>
              <i className="fas fa-times"></i>
            </button>
            {room.images && room.images.length > 1 && (
              <>
                <button
                  className="nav-button prev"
                  onClick={() => navigateImage("prev")}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  className="nav-button next"
                  onClick={() => navigateImage("next")}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;
