import React from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";
import SignInContent from "./SignInContent";
import "./SignInPage.css";

const SignInPage = () => {
  return (
    <>
      <Nav />
      <div className="sign-in-up-page-container">
        <SignInContent />
      </div>
      <Footer />
    </>
  );
};

export default SignInPage;
