import React from "react";
import StreamBtns from "./StreamBtns";
import "./FunctionRegion.css";
const StreamRegion = ({ roomId }) => {
  return (
    <div className="stream-region-container">
      <StreamBtns roomId={roomId} />
    </div>
  );
};

export default StreamRegion;
