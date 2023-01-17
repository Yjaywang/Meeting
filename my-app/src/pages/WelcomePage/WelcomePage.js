import React from "react";
import CreateBtns from "./CreateBtns";
import "./WelcomePage.css";

const WelcomePage = (props) => {
  return (
    <div className="welcome-page-container">
      <div className="welcome-page-box">
        <div className="welcome-title">welcome page</div>
        <CreateBtns />
      </div>
    </div>
  );
};

export default WelcomePage;
