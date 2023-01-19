import React, { useState } from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";

const RecordBtn = () => {
  const [isRecord, setIsRecord] = useState(false);
  const handler = () => {
    setIsRecord(!isRecord);
  };
  return (
    <div>
      <img
        className="record-btn-img"
        onClick={handler}
        src={isRecord ? RecordStopImg : RecordStartImg}
        alt=""
      />
    </div>
  );
};

export default RecordBtn;
