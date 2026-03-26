import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignInContent from "./SignInContent";
import "./SignInPage.css";
import { useAppSelector } from "../../store/hooks";

const SignInPage: React.FC = () => {
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  useEffect(() => {
    if (isSignIn) {
      window.location.href = "/";
    }
  }, [isSignIn]);
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
