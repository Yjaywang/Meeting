import React from "react";
import CamOffImg from "../../../assets/images/cam_close.svg";
import CamOnImg from "../../../assets/images/cam_open.svg";
import MicOffImg from "../../../assets/images/mic_close.svg";
import MicOnImg from "../../../assets/images/mic_open.svg";

const AttendeeBtns = ({ socketId }) => {
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
        src={MicOffImg}
        alt=""
      />
    </div>
  );
};

export default AttendeeBtns;
