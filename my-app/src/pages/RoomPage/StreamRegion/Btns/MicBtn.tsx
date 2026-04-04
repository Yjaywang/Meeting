import React from "react";
import MicMuteOnImg from "../../../../assets/images/mic_close.svg";
import MicMuteOffImg from "../../../../assets/images/mic_open.svg";
import { toggleMicBtn } from "../../../../utils/webRTCApi";
import { sendMicStatus } from "../../../../utils/webSocketApi";
import { setIsMuted } from "../../../../store/actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

const MicBtn: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((state) => state.media.isMuted);

  const handler = () => {
    toggleMicBtn(!isMuted);
    sendMicStatus(!isMuted);
    dispatch(setIsMuted(!isMuted));
  };
  return (
    <div className="text-center cursor-pointer rounded-lg transition-colors duration-300 h-[70px] w-[110px] flex items-center hover:bg-surface-dark max-[870px]:w-[50px] max-[870px]:justify-center max-[450px]:w-[35px]" onClick={handler}>
      <div>
        <img
          className="h-[25px] object-cover"
          src={isMuted ? MicMuteOnImg : MicMuteOffImg}
          alt=""
        />
        <div className="text-muted text-sm w-[110px] max-[870px]:text-xs max-[870px]:w-[50px] max-[450px]:text-[8px] max-[450px]:w-[35px]">{isMuted ? "UnMute" : "Mute"}</div>
      </div>
    </div>
  );
};

export default MicBtn;
export const storeMicIntervalData: { id: number | null; previousResult: string } = { id: null, previousResult: "" };
