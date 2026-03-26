import React, { useEffect } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useNavigate } from "react-router-dom";
import "./ProfileRegion.css";
import { refresh } from "../../../utils/fetchUserApi";
import { useAppSelector } from "../../../store/hooks";

const ProfileRegion: React.FC = () => {
  const googleId = useAppSelector((state) => state.user.googleId);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.error) {
          navigate("/signIn");
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

export default ProfileRegion;
