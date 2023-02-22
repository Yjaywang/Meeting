import React, { useState } from "react";
import StreamBtns from "./StreamBtns";
import { connect } from "react-redux";

const StreamRegion = ({
  roomId,
  isShare,
  screenStream,
  setScreenStream,
  isAttendee,
  setIsAttendee,
  isChat,
  setIsChat,
}) => {
  const [streamRecorder, setStreamRecorder] = useState(null);
  return (
    <div className="stream-region-container">
      <StreamBtns
        roomId={roomId}
        isShare={isShare}
        screenStream={screenStream}
        setScreenStream={setScreenStream}
        streamRecorder={streamRecorder}
        setStreamRecorder={setStreamRecorder}
        isAttendee={isAttendee}
        setIsAttendee={setIsAttendee}
        isChat={isChat}
        setIsChat={setIsChat}
      />
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(StreamRegion);
