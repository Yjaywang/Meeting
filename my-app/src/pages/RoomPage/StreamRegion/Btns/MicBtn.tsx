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
  // const [isMuted, setIsMuted] = useState(true);

  const handler = () => {
    toggleMicBtn(!isMuted);
    sendMicStatus(!isMuted);
    dispatch(setIsMuted(!isMuted));
    // setIsMuted(!isMuted);
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
export const storeMicIntervalData: { id: number | null; previousResult: string } = { id: null, previousResult: "" };
