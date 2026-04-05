import React, { useEffect } from "react";
import CamOffImg from "../../../assets/images/cam_close.svg";
import CamOnImg from "../../../assets/images/cam_open.svg";
import MicOffImg from "../../../assets/images/mic_close.svg";
import MicOnImg from "../../../assets/images/mic_open.svg";
import {
  toggleCamStatus,
  toggleMicStatus,
} from "../../../utils/peerDOMHandler";

interface AttendeeBtnsProps {
  socketId: string;
  selfSocketId: string;
  isMuted: boolean;
  isCamOff: boolean;
}

const AttendeeBtns: React.FC<AttendeeBtnsProps> = ({ socketId, selfSocketId, isMuted, isCamOff }) => {
  useEffect(() => {
    if (socketId === selfSocketId) {
      toggleCamStatus({
        isCamOff: isCamOff,
        selfSocketId: selfSocketId,
      });
      toggleMicStatus({
        isMuted: isMuted,
        selfSocketId: selfSocketId,
      });
    }
  }, []);
  return (
    <div className="flex gap-2.5 items-center">
      <img
        className="h-4 object-cover"
        id={`attendee-cam-img-${socketId}`}
        src={CamOnImg}
        alt=""
      />
      <img
        className="h-4 object-cover"
        id={`attendee-mic-img-${socketId}`}
        src={MicOnImg}
        alt=""
      />
    </div>
  );
};

export default AttendeeBtns;
