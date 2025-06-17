import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState("");

  // Check if we need to show the back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter signup logic here
    alert(`Thanks for subscribing with email: ${email}`);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Company Info Column */}
        <div className="column">
          <div className="logo">Phòng Trọ Sinh Viên</div>
          <p className="description">
            Nền tảng kết nối sinh viên với giải pháp ở trọ an toàn, tiện lợi và
            phù hợp với nhu cầu học tập - giúp các bạn sinh viên tìm được không
            gian sống lý tưởng.
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
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
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
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="column">
          <h3 className="column-title">Dành cho sinh viên</h3>
          <ul className="link-list">
            <li>
              <Link to="/rooms" className="link">
                Tìm phòng trọ
              </Link>
            </li>
            <li>
              <Link to="/rooms?roommate=true" className="link">
                Tìm ở ghép
              </Link>
            </li>
            <li>
              <Link to="/dormitories" className="link">
                Ký túc xá
              </Link>
            </li>
            <li>
              <Link to="/blog/student-tips" className="link">
                Mẹo cho sinh viên
              </Link>
            </li>
            <li>
              <Link to="/safety" className="link">
                An toàn & Bảo mật
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="column">
          <h3 className="column-title">Dành cho chủ nhà</h3>
          <ul className="link-list">
            <li>
              <Link to="/post-room" className="link">
                Đăng phòng
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="link">
                Bảng giá dịch vụ
              </Link>
            </li>
            <li>
              <Link to="/support" className="link">
                Hỗ trợ
              </Link>
            </li>
          </ul>
        </div>

        <div className="column">
          <h3 className="column-title">Thông tin</h3>
          <ul className="link-list">
            <li>
              <Link to="/about" className="link">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/contact" className="link">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        <div className="column">
          <h3 className="column-title">Nhận thông báo phòng mới</h3>
          <p className="description">
            Đăng ký nhận thông báo về các phòng trọ mới
          </p>
          <div className="newsletter">
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>
          © {new Date().getFullYear()} Phòng Trọ Sinh Viên. Phát triển bởi{" "}
          <a href="#" target="_blank" rel="noopener noreferrer">
            Student Room Rentals Team
          </a>
        </p>
        <div className="footer-links">
          <Link to="/terms">Điều khoản sử dụng</Link>
          <Link to="/privacy">Chính sách riêng tư</Link>
        </div>
      </div>

      <div
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </div>
    </footer>
  );
};

export default Footer;
