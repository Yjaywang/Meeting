import React, { useState } from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";
import { connect } from "react-redux";
import { setIsRecording } from "../../../../store/actions";
import {
  sendRecordingStatus,
  toggleScreenRecording,
} from "../../../../utils/webRTCApi";
import RecordRTC from "recordrtc";
import Modal3 from "../../../../components/Modal/Modal3";
import Modal from "../../../../components/Modal/Modal";
import loadingImg from "../../../../assets/images/sing-in-loading.png";
import { useHistory } from "react-router-dom";

const RecordBtn = (props) => {
  const {
    isSignIn,
    isRecording,
    setIsRecordingAction,
    screenStream,
    streamRecorder,
    setStreamRecorder,
  } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [openAccessModal, setOpenAccessModal] = useState(false);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [recordingResponse, setRecordingResponse] = useState("");

  const handler = async () => {
    if (isSignIn) {
      if (!isRecording) {
        const recorder = RecordRTC(screenStream, {
          type: "video",
          mimeType: "video/webm;codecs=vp8",
        });
        sendRecordingStatus(!isRecording);
        toggleScreenRecording(!isRecording, recorder);
        setIsRecordingAction(!isRecording);
        setStreamRecorder(recorder);
      } else {
        setLoading(true);
        sendRecordingStatus(!isRecording);
        try {
          const response = await toggleScreenRecording(
            !isRecording,
            streamRecorder
          );

          if (response.error) {
            setRecordingResponse(response.message);
          }
        } catch (error) {
          console.log("error: ", error);
        } finally {
          setLoading(false);
          setOpenRecordingModal(true);
          setIsRecordingAction(!isRecording);
          setStreamRecorder(null);
        }
      }
    } else {
      setOpenAccessModal(true);
    }
  };

  function signInBtnHandler() {
    setOpenAccessModal(false);
    history.push("/signin");
  }
  function checkBtnHandler() {
    setOpenAccessModal(false);
  }
  function checkRecordingHandler() {
    setOpenRecordingModal(false);
  }

  return (
    <div className="function-btn-container">
      <div className="recording-container" onClick={handler}>
        <img
          className="record-btn-img function-btn-img"
          src={isRecording ? RecordStopImg : RecordStartImg}
          alt=""
        />
        <div className="function-btn-name">
          {isRecording ? "Stop record" : "Start record"}
        </div>
        {loading && (
          <img src={loadingImg} className="recording-loading-img" alt="" />
        )}
      </div>
      {openAccessModal && (
        <Modal3
          modalTitle="Request For SignIn"
          modalBody="You're currently no access for this function, leave for signIn then enjoy it."
          btnHandler={signInBtnHandler}
          btnText="Sign In"
          checkBtnHandler={checkBtnHandler}
          checkBtnText="Not now"
        />
      )}
      {openRecordingModal && (
        <Modal
          modalTitle="Message"
          modalBody={recordingResponse || "Recording upload success"}
          btnHandler={checkRecordingHandler}
          btnText="OK"
        />
      )}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsRecordingAction: (isRecording) =>
      dispatch(setIsRecording(isRecording)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(RecordBtn);
