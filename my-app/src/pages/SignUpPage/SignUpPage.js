import React from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";
import SignUpContent from "./SignUpContent";

const SignUpPage = () => {
  return (
    <>
      <Nav />
      <div>
        <SignUpContent />
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
