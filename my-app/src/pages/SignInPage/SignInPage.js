import React from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";
import SignInContent from "./SignInContent";

const SignInPage = () => {
  return (
    <>
      <Nav />
      <div>
        <SignInContent />
      </div>
      <Footer />
    </>
  );
};

export default SignInPage;
