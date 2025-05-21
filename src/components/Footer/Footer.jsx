import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Column 1: Logo and Description */}
        <div className="column">
          <div className="logo">Phòng Trọ Sinh Viên</div>
          <p className="description">
            Phòng Trọ Sinh Viên là nền tảng giúp sinh viên tìm kiếm và đăng tin
            phòng trọ, ở ghép một cách dễ dàng và nhanh chóng, kết nối cộng
            đồng.
          </p>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Column 2: Search */}
        <div className="column">
          <h4 className="column-title">Tìm kiếm</h4>
          <ul className="link-list">
            <li>
              <Link to="/rooms" className="link">
                Phòng cho thuê
              </Link>
            </li>
            <li>
              <Link to="/rooms?type=roommate" className="link">
                Tìm bạn ở ghép
              </Link>
            </li>
            <li>
              <Link to="/rooms?type=shared" className="link">
                Phòng ở ghép
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="link">
                Tìm phòng theo khu vực
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="column">
          <h4 className="column-title">Dịch vụ</h4>
          <ul className="link-list">
            <li>
              <Link to="/post-room" className="link">
                Đăng tin phòng trọ
              </Link>
            </li>
            <li>
              <Link to="/my-rooms" className="link">
                Quản lý tin đăng
              </Link>
            </li>
            <li>
              <Link to="/services" className="link">
                Dịch vụ quảng cáo
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="column">
          <h4 className="column-title">Hỗ trợ</h4>
          <ul className="link-list">
            <li>
              <Link to="/faq" className="link">
                Câu hỏi thường gặp (FAQ)
              </Link>
            </li>
            <li>
              <Link to="/guide" className="link">
                Hướng dẫn sử dụng
              </Link>
            </li>
            <li>
              <Link to="/help" className="link">
                Trung tâm trợ giúp
              </Link>
            </li>
            <li>
              <Link to="/contact" className="link">
                Liên hệ chúng tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Company */}
        <div className="column">
          <h4 className="column-title">Công ty</h4>
          <ul className="link-list">
            <li>
              <Link to="/about" className="link">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/careers" className="link">
                Tuyển dụng
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="link">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/terms" className="link">
                Điều khoản dịch vụ
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="link">
                Sơ đồ trang web
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright section */}
      <div className="copyright">
        <p>&copy; {currentYear} Phòng Trọ Sinh Viên. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
