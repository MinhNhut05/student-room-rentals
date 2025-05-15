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
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomListPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/post-room" element={<PostRoomPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
