import React, { useRef, useEffect, useState } from "react";
import PreviewBtns from "./PreviewBtns";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as webRTCApi from "../../utils/webRTCApi";
import { setIsCamOff, setIsMuted } from "../../store/actions";
import camCloseImg from "../../assets/images/cam_close.svg";
import camOpenImg from "../../assets/images/cam_open.svg";
import micCloseImg from "../../assets/images/mic_close.svg";
import micOpenImg from "../../assets/images/mic_open.svg";

const PreviewContent = ({
  stream,
  setStream,
  isMuted,
  setIsMutedAction,
  isCamOff,
  setIsCamOffAction,
}) => {
  const history = useHistory();
  const screenSharingRef = useRef();
  const constrain = {
    audio: { enabled: isMuted },
    video: { width: 480, height: 360, enabled: isCamOff },
  };
  useEffect(() => {
    const getMedia = async () => {
      const mediaStream = await webRTCApi.previewCall(constrain);
      setStream(mediaStream);
    };
    getMedia();
  }, []);

  useEffect(() => {
    const video = screenSharingRef.current;
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);

  function clickHandler() {
    history.push("/room");
  }
  function micClickHandler() {
    webRTCApi.togglePreviewMicBtn(!isMuted);
    setIsMutedAction(!isMuted);
  }
  function camClickHandler() {
    webRTCApi.toggleCamBtn(!isCamOff);
    setIsCamOffAction(!isCamOff);
  }
  return (
    <div className="preview-content-container">
      <div className="preview-video-container">
        <video
          className="preview-video-element"
          muted
          autoPlay
          ref={screenSharingRef}
        ></video>
      </div>
      <div className="preview-text">
        Before enter the room, check the camera and microphone status{" "}
      </div>
      <div className="preview-mic-cam-container">
        <img
          className="preview-cam-img"
          src={isCamOff ? camCloseImg : camOpenImg}
          alt=""
          onClick={camClickHandler}
        />
        <img
          className="preview-mic-img"
          src={isMuted ? micCloseImg : micOpenImg}
          alt=""
          onClick={micClickHandler}
        />
      </div>

      <PreviewBtns clickHandler={clickHandler} />
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
    setIsMutedAction: (isMuted) => dispatch(setIsMuted(isMuted)),
    setIsCamOffAction: (isCamOff) => dispatch(setIsCamOff(isCamOff)),
  };
};

export default connect(
  mapStoreStateToProps,
  mapDispatchToProps
)(PreviewContent);
