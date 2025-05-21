import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import userService from "../../services/userService";
import "./RegisterPage.scss";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }
    if (!agreeToTerms) {
      setError("Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: email.split("@")[0], // Using part of email as name
        email,
        password,
      };

      const data = await userService.register(userData);
      login(data); // Auto-login after registration
      navigate("/rooms"); // Redirect to rooms page
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <div className="left-panel">
          <div className="logo">Phòng Trọ Sinh Viên</div>

          <div className="auth-tabs">
            <button className="tab-button active">Đăng ký</button>
            <button className="tab-button" onClick={handleSwitchToLogin}>
              Đăng nhập
            </button>
          </div>

          {/* Khối ưu đãi */}
          <div className="free-offers">
            <div className="offer-item">
              <div className="offer-icon">🏠</div>
              <p className="offer-title">5 Tin đăng miễn phí</p>
              <p className="offer-desc">cho sinh viên mới</p>
            </div>
            <div className="offer-item">
              <div className="offer-icon">📞</div>
              <p className="offer-title">50 Lượt liên hệ miễn phí</p>
              <p className="offer-desc">mỗi tháng</p>
            </div>
          </div>

          <div className="or-separator">
            <span>Hoặc tiếp tục với</span>
          </div>

          {/* Các nút đăng nhập nhanh */}
          <div className="social-login-buttons">
            <button className="social-button google">
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
              />
            </button>
            <button className="social-button apple">
              <img
                src="https://img.icons8.com/ios-filled/16/000000/mac-os.png"
                alt="Apple"
              />
            </button>
            <button className="social-button facebook">
              <img
                src="https://img.icons8.com/color/16/000000/facebook-new.png"
                alt="Facebook"
              />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="registerEmail">Email</label>
              <input
                type="email"
                id="registerEmail"
                placeholder="nhap.email.cua.ban@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error && !email ? "input-error" : ""}
              />
            </div>

            <div className="input-group">
              <label htmlFor="registerPassword">Mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="registerPassword"
                  placeholder="Mật khẩu (ít nhất 6 ký tự)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={error && !password ? "input-error" : ""}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={
                    error && (password !== confirmPassword || !confirmPassword)
                      ? "input-error"
                      : ""
                  }
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </span>
              </div>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="agreeToTerms">
                Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link>,{" "}
                <Link to="/general-terms">Điều khoản chung</Link> và{" "}
                <Link to="/privacy">Chính sách bảo mật</Link>.
              </label>
            </div>

            {error && <p className="global-error">{error}</p>}

            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        </div>

        {/* Phần hình ảnh minh họa bên phải */}
        <div className="right-panel">
          <h3 className="right-panel-title">
            Tìm phòng trọ lý tưởng trong nháy mắt!
          </h3>
          <div className="image-flow">
            <div className="flow-step">
              <div className="step-image student-image"></div>
              <p>Bước 1: Tìm kiếm phòng trọ</p>
            </div>
            <span className="flow-arrow"></span>
            <div className="flow-step">
              <div className="step-image matching-image"></div>
              <p>Bước 2: Tự động gợi ý phòng phù hợp</p>
            </div>
            <span className="flow-arrow"></span>
            <div className="flow-step">
              <div className="step-image room-image"></div>
              <p>Bước 3: Chọn phòng hoàn hảo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
