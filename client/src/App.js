// src/App.js
// Deployed after removing proxy, ngày 19/06/2025
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminRoute from "./components/routes/AdminRoute";

import HomePage from "./pages/HomePage/HomePage";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import RoomDetailPage from "./pages/RoomDetailPage/RoomDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PostRoomPage from "./pages/PostRoomPage/PostRoomPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MyRoomsPage from "./pages/MyRoomsPage/MyRoomsPage";
import EditRoomPage from "./pages/EditRoomPage/EditRoomPage";
import MyFavoritesPage from "./pages/MyFavoritesPage/MyFavoritesPage"; // <-- Thêm import
import UserListPage from "./pages/Admin/UserListPage";
import UserEditPage from "./pages/Admin/UserEditPage";
import AdminRoomListPage from "./pages/Admin/AdminRoomListPage"; // Import
import AdminReviewListPage from "./pages/Admin/AdminReviewListPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";

import "./scss/global.scss";
import { AuthProvider } from "./context/authContext";

const App = () => {
  console.log("App rendering"); // Debug log

  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            {/* === CÁC ROUTE CÔNG KHAI === */}
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomListPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* === CÁC ROUTE CẦN ĐĂNG NHẬP === */}
            <Route
              path="/post-room"
              element={
                <PrivateRoute>
                  <PostRoomPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-rooms"
              element={
                <PrivateRoute>
                  <MyRoomsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-room/:id"
              element={
                <PrivateRoute>
                  <EditRoomPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-favorites"
              element={
                <PrivateRoute>
                  <MyFavoritesPage />
                </PrivateRoute>
              }
            />

            {/* === CÁC ROUTE CHỈ DÀNH CHO ADMIN === */}
            <Route element={<AdminRoute />}>
              {/* Đặt route này làm trang chính cho admin */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route
                path="/admin/dashboard"
                element={<AdminDashboardPage />}
              />{" "}
              {/* Thêm cả hai cho chắc chắn */}
              <Route path="/admin/users" element={<UserListPage />} />
              <Route path="/admin/users/:id/edit" element={<UserEditPage />} />
              <Route path="/admin/rooms" element={<AdminRoomListPage />} />
              <Route path="/admin/reviews" element={<AdminReviewListPage />} />
              {/* Sau này chúng ta sẽ thêm các route admin khác ở đây */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
