import { React, useRef, useEffect } from "react";
import { connect } from "react-redux";

const ScreenSharing = ({ stream, selfSocketId }) => {
  const screenSharingRef = useRef();
  useEffect(() => {
    const video = screenSharingRef.current;
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);
  return (
    <div className="video-container sharing-video-container">
      <div class="video-status-container">
        <div
          class="video-recording-container hide"
          id={`sharing-recording-${selfSocketId}`}
        >
          <div class="video-recording-icon recording-circle"></div>
          <div class="video-recording-text">REC</div>
        </div>
      </div>
      <video
        className="video-element"
        muted
        autoPlay
        ref={screenSharingRef}
      ></video>
      <div class="video-name-vol-container">
        <div class="video-name-container">
          <div class="video-name-group">
            <div class="video-name" id={`sharing-username-${selfSocketId}`}>
              hahaha
            </div>
            <span
              class="video-name-status"
              id={`sharing-status-${selfSocketId}`}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(ScreenSharing);
