import React, { useState } from "react";
import MicMuteOnImg from "../../../../assets/images/mic_close.svg";
import MicMuteOffImg from "../../../../assets/images/mic_open.svg";
import * as webRTCApi from "../../../../utils/webRTCApi";

const MicBtn = () => {
  const [isMuted, setIsMuted] = useState(false);

  const handler = () => {
    webRTCApi.toggleMicBtn(!isMuted);
    setIsMuted(!isMuted);
  };
  return (
    <div className="function-btn-container " onClick={handler}>
      <div>
        <img
          className="Mic-btn-img function-btn-img"
          src={isMuted ? MicMuteOnImg : MicMuteOffImg}
          alt=""
        />
        <div className="function-btn-name">{isMuted ? "UnMute" : "Mute"}</div>
      </div>
    </div>
  );
};

export default MicBtn;
