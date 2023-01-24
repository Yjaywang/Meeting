import { React, useRef, useEffect } from "react";

const ScreenSharing = ({ stream }) => {
  const screenSharingRef = useRef();
  useEffect(() => {
    const video = screenSharingRef.current;
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);
  return (
    <div className="screen-sharing-container">
      <video muted autoPlay ref={screenSharingRef}></video>
    </div>
  );
};

export default ScreenSharing;
