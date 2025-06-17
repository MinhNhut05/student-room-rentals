import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import roomService from "../../services/roomService";
import "./UserListPage.scss"; // Tái sử dụng style từ UserListPage

const AdminReviewListPage = () => {
  const { user: adminUser } = useAuth();
  const [reviews, setReviews] = useState([]); // Khởi tạo với array rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("1. Bắt đầu gọi API lấy reviews...");
        console.log(
          "2. Admin user token:",
          adminUser.token?.substring(0, 20) + "..."
        );
        const data = await roomService.getAllReviews(adminUser.token);
        console.log("3. DỮ LIỆU API TRẢ VỀ:", data); // <--- Log quan trọng
        console.log(
          "4. Kiểu dữ liệu của data:",
          typeof data,
          Array.isArray(data)
        );
        setReviews(data || []); // Đảm bảo luôn có array
      } catch (err) {
        console.error("5. LỖI KHI GỌI API:", err); // <--- Log lỗi nếu có
        console.error("6. Chi tiết lỗi:", err.response?.data || err.message);
        setError("Không thể tải danh sách đánh giá.");
        setReviews([]); // Set array rỗng khi có lỗi
      } finally {
        console.log("7. Kết thúc quá trình fetch, đang set loading = false");
        setLoading(false);
      }
    };

    console.log("0. useEffect chạy, adminUser:", adminUser ? "có" : "không có");
    if (adminUser && adminUser.token) {
      fetchReviews();
    } else if (adminUser === null) {
      // User không đăng nhập hoặc không phải admin
      console.log("8. User null, không gọi API");
      setLoading(false);
      setError("Bạn cần đăng nhập với quyền Admin để truy cập trang này.");
    }
    // Nếu adminUser === undefined, tiếp tục loading (chờ auth check)
  }, [adminUser]);

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa đánh giá này? Thao tác này không thể hoàn tác."
      )
    ) {
      try {
        await roomService.deleteReview(id, adminUser.token);
        setReviews(reviews.filter((review) => review._id !== id));
        alert("Xóa đánh giá thành công");
      } catch (err) {
        alert(
          "Xóa đánh giá thất bại: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) return <p>Đang tải danh sách đánh giá...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-user-list-page">
      <h1>Quản lý Đánh giá ({reviews?.length || 0})</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>Người đánh giá</th>
            <th>Phòng trọ</th>
            <th>Điểm đánh giá</th>
            <th>Nội dung</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reviews &&
            reviews.length > 0 &&
            reviews.map((review) => (
              <tr key={review._id}>
                <td>
                  <div>
                    <strong>
                      {review.user?.name || "Người dùng đã bị xóa"}
                    </strong>
                    {review.user?.email && (
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>
                        {review.user.email}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {review.room ? (
                    <Link
                      to={`/rooms/${review.room._id}`}
                      style={{ color: "#007bff", textDecoration: "none" }}
                    >
                      {review.room.title}
                    </Link>
                  ) : (
                    "Phòng đã bị xóa"
                  )}
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{review.rating}/5</span>
                    <span style={{ fontSize: "1.2rem" }}>
                      {renderStars(review.rating)}
                    </span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {review.comment}
                  </div>
                </td>
                <td>
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="actions">
                  <button
                    className="btn-delete"
                    onClick={() => deleteHandler(review._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {(!reviews || reviews.length === 0) && !loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          <p>Chưa có đánh giá nào trong hệ thống.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReviewListPage;
