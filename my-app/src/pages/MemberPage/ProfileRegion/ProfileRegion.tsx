import React, { useEffect } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import "./ProfileRegion.css";
import { refresh } from "../../../utils/fetchUserApi";
import { RootState } from "../../../types/redux";

interface ProfileRegionProps {
  googleId: string;
}

const ProfileRegion: React.FC<ProfileRegionProps> = (props) => {
  const { googleId } = props;
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.error) {
          navigate("/signin");
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    checkSignIn();
  }, []);

  function pushToRecording() {
    navigate("/recording");
  }
  function pushToProfile() {
    navigate("/profile");
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

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};
export default connect(mapStoreStateToProps)(ProfileRegion);
