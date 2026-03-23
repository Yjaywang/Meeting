import React from "react";
import CamOffImg from "../../../../assets/images/cam_close.svg";
import CamOnImg from "../../../../assets/images/cam_open.svg";
import { toggleCamBtn } from "../../../../utils/webRTCApi";
import { sendCamStatus } from "../../../../utils/webSocketApi";
import { connect } from "react-redux";
import { setIsCamOff } from "../../../../store/actions";
import { RootState } from "../../../../types/redux";
import { Dispatch } from "redux";

interface CamBtnProps {
  isCamOff: boolean;
  setIsCamOffAction: (isCamOff: boolean) => void;
}

const CamBtn: React.FC<CamBtnProps> = ({ isCamOff, setIsCamOffAction }) => {
  // const [isCamOff, setIsCamOff] = useState(false);
  const handler = () => {
    toggleCamBtn(!isCamOff);
    sendCamStatus(!isCamOff);
    setIsCamOffAction(!isCamOff);
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

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setIsCamOffAction: (isCamOff: boolean) => dispatch(setIsCamOff(isCamOff)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(CamBtn);
