import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

// Component này sẽ là "người gác cổng" cho các trang của Admin
const AdminRoute = () => {
  // Lấy thông tin người dùng từ context
  const { user } = useAuth();

  // Kiểm tra 3 trường hợp:
  // 1. Đang tải thông tin user (user là undefined hoặc null trong giây lát) -> Chưa làm gì cả
  // 2. Đã có thông tin user VÀ user.isAdmin là true -> Cho phép truy cập
  // 3. Không có user hoặc user.isAdmin là false -> Chuyển hướng về trang chủ

  // Nếu user đã được xác định, kiểm tra quyền admin
  // user && user.isAdmin có nghĩa là: user phải tồn tại VÀ user.isAdmin phải là true
  return user && user.isAdmin ? (
    <Outlet /> // Nếu đúng, hiển thị các component con (các trang Admin)
  ) : (
    <Navigate to="/" replace /> // Nếu sai, chuyển hướng về trang chủ
  );
};

export default AdminRoute;
