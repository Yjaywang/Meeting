import React, { useState } from "react";
import StreamBtns from "./StreamBtns";
import { connect } from "react-redux";

const StreamRegion = ({ roomId, isShare, screenStream, setScreenStream }) => {
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
