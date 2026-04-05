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
    <div className="video-container sharing-video-container bg-gray-600 border-[5px] border-gray-600 box-border rounded-lg relative shrink-0 absolute top-[195px]">
      <div className="flex absolute z-[1]">
        <div
          className="flex items-center gap-[5px] rounded-lg bg-[rgba(26,26,26,0.5)] text-muted pl-[2px] pr-[5px] hidden"
          id={`sharing-recording-${selfSocketId}`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-danger animate-blink"></div>
          <div>REC</div>
        </div>
      </div>
      <video
        className="w-full h-full relative"
        muted
        autoPlay
        ref={screenSharingRef}
      ></video>
      <div className="flex relative -top-[26px] h-[26px] z-[1]">
        <div className="relative flex items-center gap-2.5 bg-[rgba(26,26,26,0.5)] rounded-lg text-muted pl-[2px] pr-[5px]">
          <div className="flex items-center">
            <div id={`sharing-username-${selfSocketId}`}>
              {username}
            </div>
            <span
              className="ml-[5px]"
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
