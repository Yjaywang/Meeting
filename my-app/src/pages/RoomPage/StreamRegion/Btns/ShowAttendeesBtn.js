import React, { useState } from "react";
import AttendeeImg from "../../../../assets/images/attendee.svg";

const ShowAttendeesBtn = () => {
  const [isAttendee, setIsAttendee] = useState(false);
  const handler = () => {
    setIsAttendee(!isAttendee);
  };
  return (
    <div>
      <img
        className="attendee-btn-img"
        onClick={handler}
        src={AttendeeImg}
        alt=""
      />
    </div>
  );
};

export default ShowAttendeesBtn;
