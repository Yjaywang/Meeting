import React, { useState } from "react";
import MicMuteOnImg from "../../../../assets/images/mic_close.svg";
import MicMuteOffImg from "../../../../assets/images/mic_open.svg";
const MicBtn = () => {
  const [isMuted, setIsMuted] = useState(false);
  const handler = () => {
    setIsMuted(!isMuted);
  };
  return (
    <div>
      <img
        className="Mic-btn-img"
        src={isMuted ? MicMuteOnImg : MicMuteOffImg}
        onClick={handler}
        alt=""
      />
    </div>
  );
};

export default MicBtn;
