import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignInContent from "./SignInContent";
import "./SignInPage.css";
import { connect } from "react-redux";
import { RootState } from "../../types/redux";

interface SignInPageProps {
  isSignIn?: boolean;
}

const SignInPage: React.FC<SignInPageProps> = ({ isSignIn }) => {
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

const mapStoreStateToProps = (state: RootState) => {
  return { ...state };
};

export default connect(mapStoreStateToProps)(SignInPage);
