import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./Header.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link to="/" className="logo">
          Phòng Trọ Sinh Viên
        </Link>

        <button
          className={`hamburger ${isMobileMenuOpen ? "nav-open" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/rooms" className="nav-link">
                Tìm phòng
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/post-room" className="nav-link">
                Đăng tin
              </Link>
            </li>
            {user && (
              <>
                {user.isAdmin && (
                  <li className="nav-item admin-menu">
                    <Link to="/admin/dashboard" className="nav-link">
                      Quản trị ▼
                    </Link>
                    <ul className="admin-dropdown">
                      <li>
                        <Link to="/admin/dashboard">Bảng điều khiển</Link>
                      </li>
                      <li>
                        <Link to="/admin/users">Quản lý User</Link>
                      </li>
                      <li>
                        <Link to="/admin/rooms">Quản lý Phòng</Link>
                      </li>
                      <li>
                        <Link to="/admin/reviews">Quản lý Đánh giá</Link>
                      </li>
                    </ul>
                  </li>
                )}

                <li className="nav-item">
                  <Link to="/my-rooms" className="nav-link">
                    Phòng của tôi
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-favorites" className="nav-link">
                    <i className="fas fa-heart"></i> Yêu thích
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="auth-buttons">
            {user ? (
              <>
                <Link to="/profile" className="profile-button">
                  {user.name || "Tài khoản"}
                </Link>
                <button className="logout-button" onClick={handleLogoutClick}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button className="login-button" onClick={handleLoginClick}>
                  Đăng nhập
                </button>
                <button className="signup-button" onClick={handleSignUpClick}>
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
