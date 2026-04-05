import React, { useEffect } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import BasicInfo from "./BasicInfo";
import Password from "./Password";
import { useNavigate } from "react-router-dom";
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
      <div className="w-[1200px] mx-auto mt-5 flex h-[calc(100vh-102px)] overflow-hidden max-[1200px]:w-full">
        <div className="w-[150px] bg-surface-secondary transition-all duration-300 font-bold max-[700px]:hidden">
          <div
            className="transition-colors duration-300 p-2.5 cursor-pointer hover:text-primary-hover !bg-primary !text-white"
            onClick={pushToProfile}
          >
            Profile
          </div>
          <div className="transition-colors duration-300 p-2.5 cursor-pointer hover:text-primary-hover" onClick={pushToRecording}>
            Recording
          </div>
        </div>
        <div className="flex-auto px-8 py-8 max-[1200px]:px-6 overflow-auto">
          <BasicInfo />

          {!googleId && (
            <>
              <div className="bg-surface-secondary p-[5px] rounded-md my-[30px]">Change Password</div>
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
