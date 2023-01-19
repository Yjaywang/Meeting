import React, { useState } from "react";
import CamOffImg from "../../../../assets/images/cam_close.svg";
import CamOnImg from "../../../../assets/images/cam_open.svg";
const CamBtn = () => {
  const [isCamOff, setIsCamOff] = useState(false);
  const handler = () => {
    setIsCamOff(!isCamOff);
  };
  return (
    <div>
      <img
        className="Cam-btn-img"
        src={isCamOff ? CamOffImg : CamOnImg}
        onClick={handler}
        alt=""
      />
    </div>
  );
};

export default CamBtn;
