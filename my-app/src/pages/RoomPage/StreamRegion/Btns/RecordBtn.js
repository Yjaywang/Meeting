import React, { useState } from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";

const RecordBtn = () => {
  const [isRecord, setIsRecord] = useState(false);
  const handler = () => {
    setIsRecord(!isRecord);
  };
  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="record-btn-img function-btn-img"
          src={isRecord ? RecordStopImg : RecordStartImg}
          alt=""
        />
        <div className="function-btn-name">
          {isRecord ? "Stop record" : "Start record"}
        </div>
      </div>
    </div>
  );
};

export default RecordBtn;
