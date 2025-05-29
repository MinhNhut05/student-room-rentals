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
            <p className="welcome-text">Chào mừng bạn quay trở lại!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email của bạn"
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
                  placeholder="Mật khẩu"
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
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
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
          <div className="illustration-content">
            <h3>Tìm phòng trọ dễ dàng</h3>
            <p>Kết nối sinh viên với phòng trọ chất lượng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
