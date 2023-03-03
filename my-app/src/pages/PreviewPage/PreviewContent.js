import React, { useRef, useEffect, useState } from "react";
import PreviewBtns from "./PreviewBtns";
import { useHistory } from "react-router-dom";

import { previewCall, toggleMicBtn, toggleCamBtn } from "../../utils/webRTCApi";

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
  username,
}) => {
  const history = useHistory();
  const screenSharingRef = useRef();
  const [loading, setLoading] = useState(true);
  const constrain = {
    audio: { enabled: isMuted },
    video: { width: 480, height: 360, enabled: isCamOff },
  };
  useEffect(() => {
    const getMedia = async () => {
      const mediaStream = await previewCall(constrain);
      setStream(mediaStream);
      setLoading(false);
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
    if (loading) {
      return;
    }
    history.push("/room");
  }
  function micClickHandler() {
    toggleMicBtn(!isMuted);
    setIsMutedAction(!isMuted);
  }
  function camClickHandler() {
    toggleCamBtn(!isCamOff);
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
        <div className="video-name-vol-container" id="video-container-">
          <div className="video-name-container">
            <img
              className="video-mic-img"
              id="mic-img-"
              src={isMuted ? micCloseImg : micOpenImg}
              alt=""
            />
            <div className="video-vol-bar-container">
              <div className="video-vol-bar" id="vol-bar-"></div>
            </div>
            <div className="video-name-group">
              <div className="video-name" id="username-">
                {username}
              </div>
            </div>
          </div>
        </div>
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

      <PreviewBtns clickHandler={clickHandler} loading={loading} />
    </div>
  );
};

export default PreviewContent;
