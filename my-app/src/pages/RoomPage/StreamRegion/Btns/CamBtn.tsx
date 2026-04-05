import React from "react";
import CamOffImg from "../../../../assets/images/cam_close.svg";
import CamOnImg from "../../../../assets/images/cam_open.svg";
import { toggleCamBtn } from "../../../../utils/webRTCApi";
import { sendCamStatus } from "../../../../utils/webSocketApi";
import { setIsCamOff } from "../../../../store/actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

const CamBtn: React.FC = () => {
  const dispatch = useAppDispatch();
  const isCamOff = useAppSelector((state) => state.media.isCamOff);
  // const [isCamOff, setIsCamOff] = useState(false);
  const handler = () => {
    toggleCamBtn(!isCamOff);
    sendCamStatus(!isCamOff);
    dispatch(setIsCamOff(!isCamOff));
    // setIsCamOff(!isCamOff);
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
