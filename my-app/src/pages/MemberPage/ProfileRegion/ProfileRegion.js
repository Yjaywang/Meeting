import React, { useEffect } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import "./ProfileRegion.css";

const ProfileRegion = (props) => {
  const { isSignIn, googleId } = props;
  const history = useHistory();

  useEffect(() => {
    if (!isSignIn) {
      history.push("/");
    }
  }, [isSignIn]);

  function pushToRecording() {
    history.push("/recording");
  }
  function pushToProfile() {
    history.push("/profile");
  }
  return (
    <div>
      <Nav />
      <div className="member-page-container">
        <div className="member-tabs-container">
          <div
            className="member-tab profile-tab member-tab-selected"
            onClick={pushToProfile}
          >
            Profile
          </div>
          <div className="member-tab recording-tab" onClick={pushToRecording}>
            Recording
          </div>
        </div>
        <div className="member-content-container">
          <BasicInfo />
          <div className="member-separate-bar">Change Password</div>
          <Password />
          {/* {!googleId && <></>} */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};
export default connect(mapStoreStateToProps)(ProfileRegion);
