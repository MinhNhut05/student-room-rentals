// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage/HomePage";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import RoomDetailPage from "./pages/RoomDetailPage/RoomDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PostRoomPage from "./pages/PostRoomPage/PostRoomPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MyRoomsPage from "./pages/MyRoomsPage/MyRoomsPage";
import EditRoomPage from "./pages/EditRoomPage/EditRoomPage";

import "./styles/global.scss";
import { AuthProvider } from "./context/authContext";

const App = () => {
  console.log("App rendering"); // Debug log

  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomListPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
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
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
