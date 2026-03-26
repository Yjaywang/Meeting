import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignUpContent from "./SignUpContent";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const SignUpPage: React.FC = () => {
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (isSignIn) { navigate("/"); }
  }, [isSignIn]);
  return (
    <>
      <Nav />
      <div className="sign-in-up-page-container"><SignUpContent /></div>
      <Footer />
    </>
  );
};

export default SignUpPage;
