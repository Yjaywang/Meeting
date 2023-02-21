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
      <div className="video-status-container">
        <div
          className="video-recording-container hide"
          id={`sharing-recording-${selfSocketId}`}
        >
          <div className="video-recording-icon recording-circle"></div>
          <div className="video-recording-text">REC</div>
        </div>
      </div>
      <video
        className="video-element"
        muted
        autoPlay
        ref={screenSharingRef}
      ></video>
      <div className="video-name-vol-container">
        <div className="video-name-container">
          <div className="video-name-group">
            <div className="video-name" id={`sharing-username-${selfSocketId}`}>
              hahaha
            </div>
            <span
              className="video-name-status"
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
