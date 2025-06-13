import React, { createContext, useContext, useState, useEffect } from "react";

// tạo Context để chia sẻ state người dùng và các hàm đăng nhập/đăng xuất 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // state để lưu thông tin người dùng
  const [isAuthenticated, setIsAuthenticated] = useState(false); // state để kiểm tra trạng thái đăng nhập
  const [loading, setLoading] = useState(true); // state để kiểm tra trạng thái tải dữ liệu
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => { //Hàm login - được gọi từ RegisterPage.jsx
    // nhận userData object từ backend sau khi đăng ký/đăng nhập
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData)); //tránh load trang phải gọi lại API
  };

  const logout = () => {

    localStorage.removeItem("userToken");
    setUser(null);
    console.log("User logged out, token removed from storage");
  };

  // Add the update user function
  const updateUserInContext = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
