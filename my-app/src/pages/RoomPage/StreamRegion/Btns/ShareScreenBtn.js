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
        setShareAction(true);
        const attendeeContainerEl = document.querySelector(
          ".share-screen-btn-img"
        ).parentNode.parentNode;
        attendeeContainerEl.classList.toggle("function-btn-selected");

        //if user click browser's "stop sharing"
        stream.getVideoTracks()[0].onended = async function (e) {
          //switch back to video cam
          stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          webRTCApi.toggleScreenSharing(!isShare, stream);
          setShareAction(false);
          setScreenStream(null);
          setRecordingAction(false);

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
      setShareAction(false);
      setRecordingAction(false);
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
