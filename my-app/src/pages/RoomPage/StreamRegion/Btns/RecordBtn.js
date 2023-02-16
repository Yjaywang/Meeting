import React from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";
import { connect } from "react-redux";
import { setIsRecording } from "../../../../store/actions";
import * as webRTCApi from "../../../../utils/webRTCApi";
import RecordRTC from "recordrtc";

const RecordBtn = (props) => {
  const {
    isRecording,
    setIsRecordingAction,
    screenStream,
    streamRecorder,
    setStreamRecorder,
  } = props;

  const handler = () => {
    if (!isRecording) {
      const recorder = RecordRTC(screenStream, {
        type: "video",
        mimeType: "video/webm;codecs=vp8",
      });

      webRTCApi.sendRecordingStatus(!isRecording);
      webRTCApi.toggleScreenRecording(!isRecording, recorder);
      setIsRecordingAction(!isRecording);
      setStreamRecorder(recorder);
    } else {
      webRTCApi.sendRecordingStatus(!isRecording);
      webRTCApi.toggleScreenRecording(!isRecording, streamRecorder);
      setIsRecordingAction(!isRecording);
      setStreamRecorder(null);
    }
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
    setIsRecordingAction: (isRecording) =>
      dispatch(setIsRecording(isRecording)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(RecordBtn);
