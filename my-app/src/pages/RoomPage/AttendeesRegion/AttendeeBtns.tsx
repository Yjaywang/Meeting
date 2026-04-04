import React from "react";
import CamOffImg from "../../../assets/images/cam_close.svg";
import CamOnImg from "../../../assets/images/cam_open.svg";
import MicOffImg from "../../../assets/images/mic_close.svg";
import MicOnImg from "../../../assets/images/mic_open.svg";

interface AttendeeBtnsProps {
  isMuted: boolean;
  isCamOff: boolean;
}

const AttendeeBtns: React.FC<AttendeeBtnsProps> = ({ isMuted, isCamOff }) => {
  return (
    <div className="flex gap-2.5 items-center">
      <img
        className="h-4 object-cover"
        src={isCamOff ? CamOffImg : CamOnImg}
        alt=""
      />
      <img
        className="h-4 object-cover"
        src={isMuted ? MicOffImg : MicOnImg}
        alt=""
      />
    </div>
  );
};

export default AttendeeBtns;
