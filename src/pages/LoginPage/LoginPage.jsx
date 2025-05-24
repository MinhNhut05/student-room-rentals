import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import "./LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        email,
        password,
      };

      const user = await userService.login(userData);
      login(user);

      // Store token if remember me is checked
      if (rememberMe) {
        localStorage.setItem("userToken", user.token);
      }

      navigate("/rooms");
    } catch (err) {
      setError(err.message || "Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="form-header">
            <h2>Đăng nhập</h2>
            <p className="welcome-text">
              Chào mừng bạn quay trở lại! Tìm kiếm phòng trọ ưng ý.
            </p>
          </div>

          <div className="social-login-buttons">
            <button className="social-button google">
              <i className="fab fa-google"></i>
              <span>Google</span>
            </button>
            <button className="social-button facebook">
              <i className="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </button>
            <button className="social-button apple">
              <i className="fab fa-apple"></i>
              <span>Apple</span>
            </button>
          </div>

          <div className="or-separator">
            <span>Hoặc tiếp tục với</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="nhap.email.cua.ban@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>
            </div>

            <div className="options-group">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="signup-prompt">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="signup-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <div className="illustration-section">
          {/* Floating decoration shapes */}
          <div className="floating-shape shape1"></div>
          <div className="floating-shape shape2"></div>
          <div className="floating-shape shape3"></div>

          <div className="illustration-content">
            <h3>Tìm phòng trọ dễ dàng</h3>
            <p>Kết nối sinh viên với phòng trọ chất lượng, giá tốt</p>
            <div className="feature-points">
              <div className="feature">
                <div className="feature-icon blue"></div>
                <span>Tìm kiếm nhanh chóng</span>
              </div>
              <div className="feature">
                <div className="feature-icon red"></div>
                <span>Đa dạng lựa chọn</span>
              </div>
              <div className="feature">
                <div className="feature-icon yellow"></div>
                <span>An toàn, uy tín</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;