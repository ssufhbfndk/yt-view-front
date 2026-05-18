import React from "react";
import "./AppLoader.css";
import logo from "./assets/logo.png";

const AppLoader = () => {
  return (
    <div className="app-loader">

      <div className="loader-box">

        <img src={logo} alt="logo" className="loader-logo" />

        {/* 3 DOT SPINNER */}
        <div className="loader-dots">

          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>

        </div>

        <p className="loading-text">Loading...</p>

      </div>

    </div>
  );
};

export default AppLoader;