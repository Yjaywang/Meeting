import React from "react";
import landingPageImg1 from "../../assets/images/landing-page-use-1.jpg";
import landingPageImg2 from "../../assets/images/landing-page-use-2.jpg";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const Screen1: React.FC = () => {
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const navigate = useNavigate();
  function pushToSignInHandler() {
    navigate("/signIn");
  }
  function pushToSignUpHandler() {
    navigate("/signUp");
  }
  function hostHandler() {
    navigate("/join?host=true");
  }
  function joinHandler() {
    navigate("/join");
  }
  return (
    <div className="screen-1">
      <div className="screen-1-inner-container">
        <div className="screen-1-left-container">
          <div className="screen-1-title">
            Let's <span className="screen-1-keyword">Meeting</span>
            <span>, let's be together</span>
          </div>
          <div className="screen-1-description">
            <div>Break the distance, link to each other, </div>
            <div>we're in the same place.</div>
            <div>All you need is on the Meeting platform.</div>
          </div>
          <div className="screen-1-btn-container">
            {isSignIn ? (
              <>
                <div className="screen-1-host-btn" onClick={hostHandler}>
                  Host a meeting
                </div>
                <div className="screen-1-join-btn" onClick={joinHandler}>
                  Join the meeting
                </div>
              </>
            ) : (
              <>
                <div
                  className="screen-1-sign-in-btn"
                  onClick={pushToSignInHandler}
                >
                  Sign In
                </div>
                <div
                  className="screen-1-sign-up-link"
                  onClick={pushToSignUpHandler}
                >
                  no account? sign Up here
                </div>
              </>
            )}
          </div>
        </div>
        <div className="screen-1-right-container">
          <div>
            <img className="screen-1-img-1" src={landingPageImg1} alt="" />
          </div>
          <div>
            <img className="screen-1-img-2" src={landingPageImg2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen1;
