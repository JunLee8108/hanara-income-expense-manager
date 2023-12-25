import "./Landing.css";

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Landing() {
  const { ipcRenderer } = window.require("electron");
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = { ...location.state };

  const [isPasswordCorrect, setPasswordCorrect] = useState(false);

  const handleform = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }

    if (body.password === process.env.REACT_APP_HANARA) {
      setPasswordCorrect(true);
    } else {
      return ipcRenderer.send(
        "show-warning-dialog",
        "Invalid Password.(올바르지 않은 암호)"
      );
    }
  };

  const navigateToExpenseManager = () => {
    navigate("/expense");
  };

  const navigateToIncomeManager = () => {
    navigate("/income");
    // Add your navigation logic here
  };

  return (
    <div className="landing-bg">
      <div className="landing-container animation">
        {!isPasswordCorrect ? (
          <h1>Hanara Sushi & Grill</h1>
        ) : (
          <h1 className="animation">Welcome!</h1>
        )}

        <div className="logo-container">
          {!isPasswordCorrect ? (
            <img
              src="./img/hanara.webp"
              alt="Hanara Sushi Logo"
              className="logo"
            />
          ) : (
            <img
              src="./img/hanara.webp"
              alt="Hanara Sushi Logo"
              className="logo animation"
            />
          )}
        </div>
        {isPasswordCorrect ? (
          <div className="landing-buttons-container animation">
            <button onClick={navigateToExpenseManager}>Expense Manager</button>
            <button onClick={navigateToIncomeManager}>Income Manager</button>
          </div>
        ) : (
          <div className="landing-password-container">
            <form className="landing-password-form" onSubmit={handleform}>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
              />

              <button type="submit" className="landing-password-submit">
                SUBMIT
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
