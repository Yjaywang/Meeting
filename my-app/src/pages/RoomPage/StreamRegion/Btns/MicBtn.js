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
