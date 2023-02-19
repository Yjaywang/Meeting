import React, { useState, useEffect } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import * as fetchUserApi from "../../../utils/fetchUserApi";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import "./ProfileRegion.css";

const ProfileRegion = (props) => {
  const { isSignIn } = props;
  const history = useHistory();

  useEffect(() => {
    if (!isSignIn) {
      history.push("/");
    }
  }, [isSignIn]);

  function pushToRecording() {
    history.push("/recording");
  }
  function pushToSchedulePlan() {
    history.push("/schedulePlan");
  }
  return (
    <div>
      <Nav />
      <div className="member-page-container">
        <div className="member-tabs-container">
          <div className="member-tab profile-tab member-tab-selected">
            Profile
          </div>
          <div className="member-tab recording-tab" onClick={pushToRecording}>
            Recording
          </div>
          <div
            className="member-tab schedule-plan-tab"
            onClick={pushToSchedulePlan}
          >
            Schedule Plan
          </div>
        </div>
        <div className="member-content-container">
          <BasicInfo />
          <div className="member-separate-bar">Change Password</div>
          <Password />
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
