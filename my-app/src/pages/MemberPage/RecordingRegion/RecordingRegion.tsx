import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import { useNavigate } from "react-router-dom";
import RecordingList from "./RecordingList";
import { refresh, getUserInfo } from "../../../utils/fetchUserApi";
import { IRecording } from "../../../types/models";

const RecordingRegion: React.FC = () => {
  const [recordingList, setRecordingList] = useState<IRecording[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    async function getInfo() {
      try {
        const response = await getUserInfo();
        return response.data.recording_id;
      } catch (error) {
        console.log("error: ", error);
      }
    }
    async function fetchData() {
      const recordingList = await getInfo();
      if (recordingList) {
        setRecordingList(recordingList);
      }
    }
    fetchData();
  }, []);

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
          <div className="transition-colors duration-300 p-2.5 cursor-pointer hover:text-primary-hover" onClick={pushToProfile}>
            Profile
          </div>
          <div
            className="transition-colors duration-300 p-2.5 cursor-pointer hover:text-primary-hover !bg-primary !text-white"
            onClick={pushToRecording}
          >
            Recording
          </div>
        </div>
        <div className="flex-auto px-8 py-8 max-[1200px]:px-6 overflow-auto">
          <RecordingList recordingList={recordingList} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecordingRegion;
