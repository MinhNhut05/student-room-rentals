import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import roomService from "../../services/roomService";
import "./RoomDetailPage.scss";

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <p>Đang tải chi tiết phòng...</p>
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;
  if (!room)
    return <div className="not-found-message">Không tìm thấy phòng.</div>;

  return (
    <div className="room-detail-page">
      <div className="room-detail-container">
        <h1 className="room-detail-title">{room.title}</h1>

        <div className="room-detail-main">
          <div className="room-detail-gallery">
            {room.images && room.images.length > 0 ? (
              <div className="image-grid">
                {room.images.map((imgUrl, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={imgUrl}
                      alt={`Ảnh ${index + 1}`}
                      className="room-image"
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
            <div className="info-card">
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
                    {[
                      room.address,
                      room.district ? `${room.district},` : "",
                      room.city || "",
                    ]
                      .filter(Boolean)
                      .join(" ") || "Chưa có địa chỉ"}
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
            </div>

            <div className="room-description-card">
              <h3 className="description-title">Mô tả chi tiết</h3>
              <div className="description-content">{room.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
