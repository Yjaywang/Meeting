import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignInContent from "./SignInContent";
import "./SignInPage.css";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const SignInPage = ({ isSignIn }) => {
  const history = useHistory();
  useEffect(() => {
    if (isSignIn) {
      history.push("/");
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

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(SignInPage);
