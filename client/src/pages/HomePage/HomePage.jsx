import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/HeroSection/HeroSection";
import AboutSection from "../../components/AboutSection/AboutSection";
import "./HomePage.scss";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page container-home">
      <HeroSection />
      <AboutSection />
      <div className="content-section"></div>
    </div>
  );
};

export default HomePage;
