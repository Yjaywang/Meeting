import React from "react";
import linkedInImg from "../assets/images/linkedin_icon.png";
import githubImg from "../assets/images/github_icon.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-text">Copyright ©2023 Jaywang-project</div>
      <div className="footer-icons-container">
        <a
          className="footer-icon-link"
          href="https://github.com/Yjaywang/Meeting"
        >
          <div className="footer-icon-container">
            <img className="footer-icon" src={githubImg} alt="" />
          </div>
        </a>
        <a
          className="footer-icon-link"
          href="https://www.linkedin.com/in/%E8%A1%8D%E9%9C%96-%E7%8E%8B-51a934240/"
        >
          <div className="footer-icon-container">
            <img className="footer-icon" src={linkedInImg} alt="" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Footer;
