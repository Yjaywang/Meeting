import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav/Nav";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import "./RecordingRegion.css";
import RecordingList from "./RecordingList";
import * as fetchUserApi from "../../../utils/fetchUserApi";

const RecordingRegion = (props) => {
  const { isSignIn } = props;
  const [recordingList, setRecordingList] = useState([]);

  const history = useHistory();
  useEffect(() => {
    async function getUserInfo() {
      const response = await fetchUserApi.getUserInfo();
      return response.data.recording;
    }
    async function fetchData() {
      const recordingList = await getUserInfo();
      setRecordingList(recordingList);
    }

    fetchData();
  }, []);

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
          <div className="member-tab profile-tab" onClick={pushToProfile}>
            Profile
          </div>
          <div
            className="member-tab recording-tab member-tab-selected"
            onClick={pushToRecording}
          >
            Recording
          </div>
        </div>
        <div className="member-content-container">
          <RecordingList recordingList={recordingList} />
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

export default connect(mapStoreStateToProps)(RecordingRegion);
