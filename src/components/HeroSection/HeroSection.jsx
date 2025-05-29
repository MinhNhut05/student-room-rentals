import React from "react";
import { Link } from "react-router-dom";
import "./HeroSection.scss";
import mainImg from "../../assets/img/26.jpg"; // Update path as needed
import mini1 from "../../assets/img/25.jpg"; // Update path as needed
import mini2 from "../../assets/img/27.jpg"; // Update path as needed
import mini3 from "../../assets/img/28.jpg"; // Update path as needed

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-texts">
          <span className="hero-subtitle">Xin chào tân sinh viên!</span>
          <h1>
            Tìm Phòng Trọ <br />
            Nhanh, An Toàn, <br />
            <span className="highlight">Dễ Dàng!</span>
          </h1>
          <p>
            Nền tảng kết nối sinh viên thuê phòng trọ: An toàn – minh bạch – hỗ
            trợ 24/7.
            <br />
            Dễ dàng tìm phòng trọ, ở ghép, và kết nối cộng đồng sinh viên trên
            toàn quốc.
          </p>
          <div className="hero-cta">
            <Link className="hero-link primary" to="/rooms">
              Tìm phòng ngay
            </Link>
            <Link className="hero-link secondary" to="/post-room">
              Đăng tin phòng
            </Link>
          </div>
        </div>
        <div className="hero-image-group">
          <div className="hero-main-image">
            <img src={mainImg} alt="Phòng trọ mẫu" />
            <div className="hero-badge">
              Chỉ từ
              <br />
              <span>1,2tr/tháng</span>
            </div>
          </div>
          <div className="hero-mini-images">
            <img src={mini1} alt="Phòng đẹp 1" />
            <img src={mini2} alt="Phòng đẹp 2" />
            <img src={mini3} alt="Phòng đẹp 3" />
            <div className="mini-image-count">+200</div>
          </div>
        </div>
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="stat-number">128</span>
          <span className="stat-label">Ký túc xá liên kết</span>
        </div>
        <div className="hero-stat">
          <span className="stat-number">5000+</span>
          <span className="stat-label">Tin phòng trọ</span>
        </div>
        <div className="hero-stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Hỗ trợ nhanh</span>
        </div>
        <div className="hero-stat">
          <span className="stat-number">98%</span>
          <span className="stat-label">Khách hài lòng</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
