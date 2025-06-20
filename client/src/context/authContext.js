import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// tạo Context để chia sẻ state người dùng và các hàm đăng nhập/đăng xuất
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect này sẽ chạy một lần khi ứng dụng khởi động
  // để kiểm tra xem có thông tin người dùng trong localStorage không
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    }
  }, []);

  const login = (userData) => {
    // Lưu thông tin người dùng vào state và localStorage
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Chuyển hướng dựa trên vai trò của người dùng
    if (userData.isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    // Xóa thông tin người dùng khỏi state và localStorage
    setUser(null);
    localStorage.removeItem("user");
    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  const updateUserInContext = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  // Giá trị được cung cấp cho toàn bộ ứng dụng
  const value = {
    // isAuthenticated có thể được suy ra một cách an toàn: !!user
    isAuthenticated: !!user,
    user,
    login,
    logout,
    updateUserInContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
