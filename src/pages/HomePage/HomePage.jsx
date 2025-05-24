import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/HeroSection/HeroSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import "./HomePage.scss";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="home-page container-home">
      <HeroSection />
      <AboutSection />
      <div className="content-section">
        
      </div>
    </div>
  );
};

export default HomePage;