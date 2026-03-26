import React, { useRef, useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";

interface ScreenSharingProps {
  stream: MediaStream | null;
}

const ScreenSharing: React.FC<ScreenSharingProps> = ({ stream }) => {
  const selfSocketId = useAppSelector((state) => state.room.selfSocketId);
  const username = useAppSelector((state) => state.user.username);
  const isHost = useAppSelector((state) => state.room.isHost);
  const screenSharingRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = screenSharingRef.current;
    if (video) {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
      };
    }
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
              {username}
            </div>
            <span
              className="video-name-status"
              id={`sharing-status-${selfSocketId}`}
            >
              {isHost ? "(Host) (sharing)" : "(sharing)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenSharing;
