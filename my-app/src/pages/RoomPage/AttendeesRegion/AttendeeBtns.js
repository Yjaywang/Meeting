import React, { useEffect } from "react";
import CamOffImg from "../../../assets/images/cam_close.svg";
import CamOnImg from "../../../assets/images/cam_open.svg";
import MicOffImg from "../../../assets/images/mic_close.svg";
import MicOnImg from "../../../assets/images/mic_open.svg";
import {
  toggleCamStatus,
  toggleMicStatus,
} from "../../../utils/peerDOMHandler";

const AttendeeBtns = ({ socketId, selfSocketId, isMuted, isCamOff }) => {
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
    <div className="attendee-cam-mic-container">
      <img
        className="attendee-cam-mic-img"
        id={`attendee-cam-img-${socketId}`}
        src={CamOnImg}
        alt=""
      />
      <img
        className="attendee-cam-mic-img"
        id={`attendee-mic-img-${socketId}`}
        src={MicOnImg}
        alt=""
      />
    </div>
  );
};

export default AttendeeBtns;
