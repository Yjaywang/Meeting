import React from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";
import { connect } from "react-redux";
import { setRecording } from "../../../../store/actions";

const RecordBtn = (props) => {
  const { isRecording, setRecordingAction } = props;

  const handler = () => {
    setRecordingAction(!isRecording);
  };
  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="record-btn-img function-btn-img"
          src={isRecording ? RecordStopImg : RecordStartImg}
          alt=""
        />
        <div className="function-btn-name">
          {isRecording ? "Stop record" : "Start record"}
        </div>
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
    setRecordingAction: (isRecording) => dispatch(setRecording(isRecording)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(RecordBtn);
