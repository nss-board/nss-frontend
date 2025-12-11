import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/AppStyles.css";
import HeaderDesktop from "./widgets/HeaderDesktop";
import MainDesktop from "./widgets/MainDesktop";
import FooterDesktop from "./widgets/FooterDesktop";
import LoginDesktop from "./widgets/LoginDesktop";
import RegisterDesktop from "./widgets/RegisterDesktop";
import ArticleDesktop from "./widgets/ArticleDesktop";
import AddDesktop from "./widgets/AddDesktop";

export default function App() {
  /* 모바일 */
  const getScreenSize = () => {
    const width = window.innerWidth;
    if (width <= 480) return "mobile";
    return "desktop";
  };

  const [screenSize, setScreenSize] = useState(getScreenSize());

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app-container">
            {screenSize === "mobile" ? <HeaderDesktop /> : <HeaderDesktop />}
            {screenSize === "mobile" ? <MainDesktop /> : <MainDesktop />}
            {screenSize === "mobile" ? <FooterDesktop /> : <FooterDesktop />}
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="app-container">
            {screenSize === "mobile" ? <LoginDesktop /> : <LoginDesktop />}
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="app-container">
            {screenSize === "mobile" ? (
              <RegisterDesktop />
            ) : (
              <RegisterDesktop />
            )}
          </div>
        }
      />
      <Route
        path="/article/:id"
        element={
          <div className="app-container">
            {screenSize === "mobile" ? <ArticleDesktop /> : <ArticleDesktop />}
          </div>
        }
      />
      <Route
        path="/add"
        element={
          <div className="app-container">
            {screenSize === "mobile" ? <AddDesktop /> : <AddDesktop />}
          </div>
        }
      />
    </Routes>
  );
}
