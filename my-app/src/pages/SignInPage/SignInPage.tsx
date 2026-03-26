import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignInContent from "./SignInContent";
import "./SignInPage.css";
import { useAppSelector } from "../../store/hooks";

const SignInPage: React.FC = () => {
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (isSignIn) {
      navigate("/");
    }
  }, [isSignIn, navigate]);
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
