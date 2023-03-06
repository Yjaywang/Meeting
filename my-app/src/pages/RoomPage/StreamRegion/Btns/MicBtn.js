import React from "react";
import MicMuteOnImg from "../../../../assets/images/mic_close.svg";
import MicMuteOffImg from "../../../../assets/images/mic_open.svg";
import { toggleMicBtn } from "../../../../utils/webRTCApi";
import { sendMicStatus } from "../../../../utils/webSocketApi";
import { connect } from "react-redux";
import { setIsMuted } from "../../../../store/actions";

const MicBtn = ({ isMuted, setIsMutedAction }) => {
  // const [isMuted, setIsMuted] = useState(true);

  const handler = () => {
    toggleMicBtn(!isMuted);
    sendMicStatus(!isMuted);
    setIsMutedAction(!isMuted);
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

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsMutedAction: (isMuted) => dispatch(setIsMuted(isMuted)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(MicBtn);
export const storeMicIntervalData = { id: null, previousResult: "" };
