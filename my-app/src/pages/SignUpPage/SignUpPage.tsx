import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignUpContent from "./SignUpContent";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectIsSignIn } from "../../store/selectors";

const SignUpPage: React.FC = () => {
  const isSignIn = useAppSelector(selectIsSignIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (isSignIn) { navigate("/"); }
  }, [isSignIn]);
  return (
    <>
      <Nav />
      <div className="overflow-auto w-full h-[calc(100vh-82px)] flex items-center justify-center">
        <SignUpContent />
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
