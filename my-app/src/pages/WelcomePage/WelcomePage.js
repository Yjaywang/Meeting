import React from "react";
import CreateBtns from "./CreateBtns";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import "./WelcomePage.css";
import "./Base.css";

const WelcomePage = (props) => {
  return (
    <>
      <Nav />
      <div className="welcome-page-container">
        <div className="welcome-page-box">
          <div className="welcome-title">Let's Meeting!</div>
          <CreateBtns />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WelcomePage;
