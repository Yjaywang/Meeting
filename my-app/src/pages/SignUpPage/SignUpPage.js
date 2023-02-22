import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav/Nav";
import SignUpContent from "./SignUpContent";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const SignUpPage = ({ isSignIn }) => {
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
        <SignUpContent />
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

export default connect(mapStoreStateToProps)(SignUpPage);
