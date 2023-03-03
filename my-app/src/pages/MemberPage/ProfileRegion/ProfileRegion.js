import React, { useEffect } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import "./ProfileRegion.css";
import { refresh } from "../../../utils/fetchUserApi";

const ProfileRegion = (props) => {
  const { googleId } = props;
  const history = useHistory();

  useEffect(() => {
    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.error) {
          history.push("/signin");
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    checkSignIn();
  }, []);

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

          {!googleId && (
            <>
              <div className="member-separate-bar">Change Password</div>
              <Password />
            </>
          )}
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
