import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="home-page">
      <h1>Welcome to Student Room Rentals</h1>
      <p>Find your perfect student accommodation</p>
      {/* Add more content for authenticated users */}
    </div>
  );
};

export default HomePage;
