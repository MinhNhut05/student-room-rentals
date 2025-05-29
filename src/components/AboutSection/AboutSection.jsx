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
    </section>
  );
};

export default AboutSection;
