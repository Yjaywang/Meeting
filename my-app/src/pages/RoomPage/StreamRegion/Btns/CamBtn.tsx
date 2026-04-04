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
  const handler = () => {
    toggleCamBtn(!isCamOff);
    sendCamStatus(!isCamOff);
    dispatch(setIsCamOff(!isCamOff));
  };
  return (
    <div className="text-center cursor-pointer rounded-lg transition-colors duration-300 h-[70px] w-[110px] flex items-center hover:bg-surface-dark max-[870px]:w-[50px] max-[870px]:justify-center max-[450px]:w-[35px]" onClick={handler}>
      <div>
        <img
          className="h-[25px] object-cover"
          src={isCamOff ? CamOffImg : CamOnImg}
          alt=""
        />
        <div className="text-muted text-sm w-[110px] max-[870px]:text-xs max-[870px]:w-[50px] max-[450px]:text-[8px] max-[450px]:w-[35px]">
          {isCamOff ? "Start video" : "Stop video"}
        </div>
      </div>
    </div>
  );
};

export default CamBtn;
