import React, { useState } from "react";
import ShareScreenImg from "../../../../assets/images/share_screen.svg";
import ScreenSharing from "./ScreenSharing";
import * as webRTCApi from "../../../../utils/webRTCApi";
import { connect } from "react-redux";
import { setRecording, setShare } from "../../../../store/actions";

const constrains = {
  audio: false,
  video: true,
};
const ShareScreenBtn = (props) => {
  const {
    isShare,
    setShareAction,
    screenStream,
    setScreenStream,
    setRecordingAction,
    streamRecorder,
    setStreamRecorder,
  } = props;

  const handler = async () => {
    if (!isShare) {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constrains);
      } catch (error) {
        console.log("share screen error: ", error);
      }
      if (stream) {
        //share screen
        //screenStream will update after render
        setScreenStream(stream);
        webRTCApi.toggleScreenSharing(!isShare, stream);
        webRTCApi.sendShareStatus(!isShare);
        setShareAction(true);
        const attendeeContainerEl = document.querySelector(
          ".share-screen-btn-img"
        ).parentNode.parentNode;
        attendeeContainerEl.classList.toggle("function-btn-selected");

        //if user click browser's "stop sharing"
        //this kind of end sharing, close recorder at record btn, because the recorder state still null here
        stream.getVideoTracks()[0].onended = async function (e) {
          webRTCApi.toggleScreenSharing(false);
          webRTCApi.sendShareStatus(false);
          webRTCApi.sendRecordingStatus(false);
          webRTCApi.toggleScreenRecording(false);
          setShareAction(false);
          setRecordingAction(false);
          setScreenStream(null);
          setStreamRecorder(null);

          const attendeeContainerEl = document.querySelector(
            ".share-screen-btn-img"
          ).parentNode.parentNode;
          attendeeContainerEl.classList.toggle("function-btn-selected");
        };
      }
    } else {
      // if user click screen share again when sharing, close share stream
      //switch back to video cam
      webRTCApi.toggleScreenSharing(!isShare);
      webRTCApi.sendShareStatus(!isShare);
      webRTCApi.sendRecordingStatus(false);
      webRTCApi.toggleScreenRecording(false, streamRecorder);
      setShareAction(false);
      setRecordingAction(false);
      setStreamRecorder(null);

      //stop sharing screen
      screenStream.getTracks().forEach((track) => {
        track.stop();
      });
      setScreenStream(null);

      const attendeeContainerEl = document.querySelector(
        ".share-screen-btn-img"
      ).parentNode.parentNode;
      attendeeContainerEl.classList.toggle("function-btn-selected");
    }

    // setShareAction(!isShare);
  };

  return (
    <>
      <div className="function-btn-container" onClick={handler}>
        <div>
          <img
            className="share-screen-btn-img function-btn-img"
            src={ShareScreenImg}
            alt=""
          />
          <div className="function-btn-name share-btn-name">
            {isShare ? "Stop share" : "Start share"}
          </div>
        </div>
      </div>

      {isShare && <ScreenSharing stream={screenStream} />}
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShareAction: (isShare) => dispatch(setShare(isShare)),
    setRecordingAction: (isRecording) => dispatch(setRecording(isRecording)),
  };
};

export default connect(
  mapStoreStateToProps,
  mapDispatchToProps
)(ShareScreenBtn);
