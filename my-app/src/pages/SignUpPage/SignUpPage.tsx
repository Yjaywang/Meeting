import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignUpContent from "./SignUpContent";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../types/redux";

interface SignUpPageProps {
  isSignIn?: boolean;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ isSignIn }) => {
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

const mapStoreStateToProps = (state: RootState) => { return { ...state }; };
export default connect(mapStoreStateToProps)(SignUpPage);
