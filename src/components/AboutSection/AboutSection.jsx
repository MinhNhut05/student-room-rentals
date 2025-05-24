import React from "react";
import { Link } from "react-router-dom";
import "./AboutSection.scss";
import aboutImg1 from "../../assets/img/30.jpg"; // Update path as needed
import aboutImg2 from "../../assets/img/29.jpg"; // Update path as needed

const AboutSection = () => {
  return (
    <section className="about-section">
      {/* Hero/Intro */}
      <div className="about-hero">
        <h1>
          <span className="highlight1">Nền tảng</span>{" "}
          <span className="highlight2">Tìm Phòng Trọ Sinh Viên</span> <br />
          Dành cho thế hệ <span className="highlight3">năng động</span>
        </h1>
        <p>
          Kết nối sinh viên với hàng ngàn lựa chọn phòng trọ, ở ghép – An toàn,
          hiện đại, minh bạch, hỗ trợ 24/7.
        </p>
        <div className="about-features">
          <button className="feature-btn active">Phòng trọ</button>
          <button className="feature-btn">Ở ghép</button>
          <button className="feature-btn">Ký túc xá</button>
          <button className="feature-btn">Góc sinh viên</button>
        </div>
      </div>

      {/* Block 1: Image + text + CTA */}
      <div className="about-block about-block-reverse">
        <img src={aboutImg1} alt="Tìm phòng nhanh" className="about-img" />
        <div className="about-block-text">
          <h2>
            <span className="highlight2">Tìm phòng trọ</span> chỉ với{" "}
            <span className="highlight1">vài giây</span>
          </h2>
          <p>
            Lọc phòng theo vị trí, giá, tiện nghi – cập nhật tin mới mỗi ngày,
            thông tin minh bạch, hỗ trợ trực tiếp từ chủ nhà hoặc cộng tác viên
            sinh viên.
          </p>
          <Link to="/rooms" className="cta-btn">
            Khám phá ngay
          </Link>
        </div>
      </div>

      {/* Block 2: Text + image */}
      <div className="about-block">
        <div className="about-block-text">
          <h2>
            Nền tảng <span className="highlight3">an toàn, hiện đại</span>
          </h2>
          <p>
            Đăng nhập, quản lý tin đăng, chat với chủ phòng, đặt phòng online,
            tích hợp bản đồ, xác thực thông tin giúp bạn yên tâm chọn lựa.
          </p>
          <Link to="/register" className="cta-btn">
            Đăng ký miễn phí
          </Link>
        </div>
        <img src={aboutImg2} alt="An toàn - hiện đại" className="about-img" />
      </div>

      {/* Block 3: Features map/network */}
      <div className="about-integrations">
        <h3>
          <span className="highlight2">Kết nối</span> cộng đồng
        </h3>
        <p>
          Kết nối với hàng nghìn sinh viên, chủ phòng, trường đại học, nhà tuyển
          dụng – cùng chia sẻ cơ hội và thông tin hữu ích!
        </p>
        <div className="integration-map">
          <div className="icon-link">
            <span role="img" aria-label="Chat">
              💬
            </span>{" "}
            Chat
          </div>
          <div className="icon-link">
            <span role="img" aria-label="Map">
              🗺️
            </span>{" "}
            Bản đồ
          </div>
          <div className="icon-link">
            <span role="img" aria-label="Shield">
              🛡️
            </span>{" "}
            An toàn
          </div>
          <div className="icon-link">
            <span role="img" aria-label="Community">
              👥
            </span>{" "}
            Cộng đồng
          </div>
          <div className="icon-link">
            <span role="img" aria-label="Star">
              ⭐
            </span>{" "}
            Đánh giá
          </div>
          <div className="icon-link">
            <span role="img" aria-label="24h">
              ⏰
            </span>{" "}
            24/7
          </div>
          <div className="icon-link">
            <span role="img" aria-label="Handshake">
              🤝
            </span>{" "}
            Hợp tác
          </div>
          <div className="icon-link">
            <span role="img" aria-label="University">
              🏫
            </span>{" "}
            Trường học
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="about-stats">
        <div className="stat-item">
          <div className="stat-number">5,000+</div>
          <div className="stat-label">Phòng trọ</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Sinh viên</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Trường liên kết</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Hỗ trợ</div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;