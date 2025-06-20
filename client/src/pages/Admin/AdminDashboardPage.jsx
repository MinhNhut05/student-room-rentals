import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import adminService from "../../services/adminService";
import "./AdminDashboardPage.scss"; // Tạo file style này
// Dòng comment để ép deploy lại, ngày 19/06/2025
// Dòng comment để ép deploy lại, ngày 20/06/2025
// Dòng comment để ép deploy lại, ngày 20/06/2025
// Một component nhỏ để hiển thị từng ô thống kê cho đẹp
const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { user: adminUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats(adminUser.token);
        setStats(data);
      } catch (error) {
        console.error("Không thể tải dữ liệu thống kê", error);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    if (adminUser && adminUser.token) {
      fetchStats();
    } else if (adminUser === null) {
      setLoading(false);
      setError("Bạn cần đăng nhập với quyền Admin để truy cập trang này.");
    }
  }, [adminUser]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-dashboard-page">
      <h1>Bảng điều khiển Admin</h1>
      {stats ? (
        <div className="stats-grid">
          <StatCard
            title="Tổng số người dùng"
            value={stats.users || 0}
            icon="👥"
          />
          <StatCard
            title="Tổng số phòng trọ"
            value={stats.rooms || 0}
            icon="🏠"
          />
          <StatCard
            title="Tổng số đánh giá"
            value={stats.reviews || 0}
            icon="⭐"
          />
        </div>
      ) : (
        <p>Không có dữ liệu thống kê để hiển thị.</p>
      )}
    </div>
  );
};

export default AdminDashboardPage;
