import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import userService from "../../services/userService"; // <-- Thêm import
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

  // State cho form đánh giá
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // State cho việc xử lý submit review
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // State cho form TRẢ LỜI ĐÁNH GIÁ của chủ phòng
  const [replyText, setReplyText] = useState("");
  const [activeReplyForm, setActiveReplyForm] = useState(null); // Lưu ID của review đang được trả lời

  // --- PHẦN MỚI CHO TÍNH NĂNG YÊU THÍCH ---
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(true);

  // Hàm xử lý khi nhấn nút Yêu thích / Bỏ thích
  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }

    try {
      if (isFavorited) {
        // Nếu đã thích, thì gọi API bỏ thích
        await userService.removeFromFavorites(id, user.token);
        setIsFavorited(false);
      } else {
        // Nếu chưa thích, thì gọi API thêm vào yêu thích
        await userService.addToFavorites(id, user.token);
        setIsFavorited(true);
      }
    } catch (err) {
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
      console.error("Favorite toggle error:", err);
    }
  };

  // Hàm fetch dữ liệu chi tiết phòng
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const data = await roomService.getRoomById(id);
      setRoom(data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải thông tin phòng.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(id);
        setRoom(roomData);

        // Sau khi có dữ liệu phòng, kiểm tra xem người dùng đã thích phòng này chưa
        if (user) {
          setFavoriteLoading(true);
          const favoriteRooms = await userService.getMyFavorites(user.token);
          // some() sẽ trả về true nếu tìm thấy ít nhất 1 phần tử thỏa mãn
          const alreadyFavorited = favoriteRooms.some(
            (favRoom) => favRoom._id === id
          );
          setIsFavorited(alreadyFavorited);
          setFavoriteLoading(false);
        } else {
          setFavoriteLoading(false);
        }
      } catch (err) {
        setError("Không thể tải thông tin phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id, user]); // Thêm 'user' vào dependency array để kiểm tra lại khi user đăng nhập/đăng xuất

  // Hàm xử lý khi người dùng gửi form đánh giá
  const reviewSubmitHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      const reviewData = { rating, comment };
      await roomService.createRoomReview(id, reviewData, user.token);

      setReviewLoading(false);
      setReviewSuccess(true);
      setRating(0); // Reset form
      setComment(""); // Reset form

      alert("Gửi đánh giá thành công!");
      fetchRoomDetails(); // Tải lại dữ liệu để hiển thị review mới
    } catch (error) {
      setReviewLoading(false);
      setReviewError(error.message || "Gửi đánh giá thất bại");
    }
  };

  // Hàm xử lý khi chủ phòng gửi trả lời
  const replySubmitHandler = async (e, reviewId) => {
    e.preventDefault();
    try {
      await roomService.addReviewReply(
        reviewId,
        { comment: replyText },
        user.token
      );
      alert("Gửi trả lời thành công!");
      fetchRoomDetails(); // Tải lại dữ liệu để hiển thị reply mới
      setActiveReplyForm(null); // Đóng form trả lời lại
      setReplyText(""); // Reset nội dung reply
    } catch (err) {
      alert("Gửi trả lời thất bại: " + err.message);
    }
  };

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
        <div className="sk-folding-cube" aria-label="loading">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
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

  const isOwner = user && user._id === room.owner?._id;

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        <div className="room-header">
          <h1 className="room-detail-title">{room.title}</h1>

          {/* --- NÚT YÊU THÍCH MỚI --- */}
          {user && ( // Chỉ hiển thị nút nếu người dùng đã đăng nhập
            <button
              className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i
                    className={`${
                      isFavorited ? "fas fa-heart" : "far fa-heart"
                    }`}
                  ></i>
                  {isFavorited ? " Đã thích" : " Yêu thích"}
                </>
              )}
            </button>
          )}
        </div>

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

        {/* --- PHẦN ĐÁNH GIÁ VÀ TRẢ LỜI --- */}
        <div className="reviews-section fade-in">
          <h3 className="reviews-title">
            <i className="fas fa-star review-icon"></i>
            Đánh giá của khách hàng ({room?.numReviews || 0} đánh giá)
          </h3>

          {/* Hiển thị điểm rating trung bình */}
          {room?.rating > 0 && (
            <div className="rating-summary">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`star ${
                      i < Math.floor(room.rating) ? "filled" : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-number">{room.rating.toFixed(1)}/5</span>
            </div>
          )}

          {/* Hiển thị danh sách các đánh giá đã có */}
          {room?.reviews && room.reviews.length === 0 && (
            <p className="no-reviews">Chưa có đánh giá nào.</p>
          )}

          <div className="review-list">
            {room?.reviews &&
              room.reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <strong className="reviewer-name">{review.name}</strong>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < review.rating ? "filled" : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <small className="review-date">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </small>

                  {/* Hiển thị các câu trả lời của chủ phòng */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="replies-list">
                      <h4 className="replies-title">Phản hồi từ chủ phòng:</h4>
                      {review.replies.map((reply) => (
                        <div key={reply._id} className="reply-item">
                          <div className="reply-header">
                            <strong className="reply-owner">
                              {reply.name}
                            </strong>
                            <span className="owner-badge">Chủ phòng</span>
                            <small className="reply-date">
                              {new Date(reply.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </small>
                          </div>
                          <p className="reply-comment">{reply.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nút và Form trả lời cho CHỦ PHÒNG */}
                  {isOwner && (
                    <div className="reply-action">
                      {activeReplyForm !== review._id ? (
                        <button
                          className="reply-btn"
                          onClick={() => setActiveReplyForm(review._id)}
                        >
                          <i className="fas fa-reply"></i> Trả lời
                        </button>
                      ) : (
                        <form
                          className="reply-form"
                          onSubmit={(e) => replySubmitHandler(e, review._id)}
                        >
                          <textarea
                            rows="3"
                            placeholder="Viết câu trả lời của bạn..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            required
                            className="reply-textarea"
                          />
                          <div className="reply-form-actions">
                            <button type="submit" className="reply-submit-btn">
                              Gửi trả lời
                            </button>
                            <button
                              type="button"
                              className="reply-cancel-btn"
                              onClick={() => {
                                setActiveReplyForm(null);
                                setReplyText("");
                              }}
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Form để lại đánh giá */}
          <div className="review-form-container">
            <h3 className="form-title">Để lại đánh giá của bạn</h3>

            {user ? (
              room.owner?._id === user._id ? (
                <div className="owner-notice">
                  <i className="fas fa-info-circle"></i>
                  <p>Bạn là chủ của phòng này nên không thể để lại đánh giá.</p>
                </div>
              ) : (
                <form onSubmit={reviewSubmitHandler} className="review-form">
                  <div className="form-group">
                    <label htmlFor="rating">Chất lượng</label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                    >
                      <option value="">Chọn...</option>
                      <option value="1">1 - Rất tệ</option>
                      <option value="2">2 - Tệ</option>
                      <option value="3">3 - Ổn</option>
                      <option value="4">4 - Tốt</option>
                      <option value="5">5 - Rất tốt</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="comment">Bình luận</label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..."
                      required
                    />
                  </div>

                  {reviewLoading && (
                    <p className="loading-message">Đang gửi...</p>
                  )}
                  {reviewError && (
                    <p className="error-message">{reviewError}</p>
                  )}
                  {reviewSuccess && (
                    <p className="success-message">Cảm ơn bạn đã đánh giá!</p>
                  )}

                  <button
                    type="submit"
                    className="submit-review-btn"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>
              )
            ) : (
              <p className="login-prompt">
                Vui lòng{" "}
                <a href="/login" className="login-link">
                  đăng nhập
                </a>{" "}
                để để lại đánh giá.
              </p>
            )}
          </div>
        </div>

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
