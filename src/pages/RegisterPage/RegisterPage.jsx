import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { useAuth } from "../../context/authContext";
import "./RegisterPage.scss";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự");
      return;
    }

    setIsLoading(true); //gọi setIsLoading -> true để hiển thị loading

    try { // sử  lý các lệnh có thể gây ra lỗi
      const newUser = await userService.register({ // gọi hàm register từ userService
        name, // truyền các thông tin người dùng
        email,
        phone,
        password,
      });
      login(newUser); // gọi hàm login từ context để lưu thông tin người dùng mới vào context
      navigate("/"); // chuyển hướng về trang chính sau khi đăng ký thành công
    } catch (err) { // nếu có lỗi xảy ra trong quá trình đăng ký
      setError(err.message || "Đăng ký thất bại"); 
    } finally { // cuối cùng, dù thành công hay thất bại, sẽ gọi setIsLoading -> false để ẩn loading
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-illustration">
          <div className="bg-deco bg-deco1"></div>
          <div className="bg-deco bg-deco2"></div>
          <div className="register-info">
            <h2>
              Chào mừng bạn đến với
              <br />
              <span>Phòng Trọ Sinh Viên</span>
            </h2>
            <p>
              Tìm kiếm, kết nối và đăng phòng trọ chỉ với một tài khoản miễn
              phí.
              <br />
              Đăng ký để trải nghiệm tiện ích hiện đại, an toàn và bảo mật!
            </p>
            <ul className="feature-list">
              <li>
                <span className="feature-dot green"></span>
                Dễ dàng tìm phòng, tìm bạn ở ghép
              </li>
              <li>
                <span className="feature-dot purple"></span>
                Đăng tin nhanh chóng, giao diện thân thiện
              </li>
              <li>
                <span className="feature-dot orange"></span>
                Bảo mật thông tin cá nhân tuyệt đối
              </li>
            </ul>
          </div>
        </div>

        <div className="register-form-section">
          <div className="form-header">
            <h2>Tạo tài khoản mới</h2>
            <p className="desc">Miễn phí. Không quảng cáo. An toàn dữ liệu.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form
            className="register-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="form-group">
              <label htmlFor="name">Họ tên</label>
              <input
                type="text"
                id="name"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="nhap.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                placeholder="VD: 0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Tạo mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang xử lý...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>

          <div className="login-switch">
            Đã có tài khoản?{" "}
            <Link to="/login" className="login-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
