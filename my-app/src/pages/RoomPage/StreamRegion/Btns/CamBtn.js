import React, { useState } from "react";
import CamOffImg from "../../../../assets/images/cam_close.svg";
import CamOnImg from "../../../../assets/images/cam_open.svg";
import * as webRTCApi from "../../../../utils/webRTCApi";

const CamBtn = () => {
  const [isCamOff, setIsCamOff] = useState(false);
  const handler = () => {
    webRTCApi.toggleCamBtn(!isCamOff);
    setIsCamOff(!isCamOff);
  };
  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="Cam-btn-img function-btn-img"
          src={isCamOff ? CamOffImg : CamOnImg}
          alt=""
        />
        <div className="function-btn-name">
          {isCamOff ? "Start video" : "Stop video"}
        </div>
      </div>
    </div>
  );
};

export default CamBtn;
