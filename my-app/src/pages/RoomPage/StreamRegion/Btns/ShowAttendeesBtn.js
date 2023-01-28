import React, { useState } from "react";
import AttendeeImg from "../../../../assets/images/attendee.svg";

const ShowAttendeesBtn = () => {
  const [isAttendee, setIsAttendee] = useState(false);
  const handler = () => {
    setIsAttendee(!isAttendee);
    const attendeeContainerEl =
      document.querySelector(".attendee-btn-img").parentNode.parentNode;
    attendeeContainerEl.classList.toggle("function-btn-selected");

    const attendeeRegionContainerEl = document.querySelector(
      ".attendee-region-container"
    );
    attendeeRegionContainerEl.classList.toggle("hide");

    //chat or attendee not hide, remove container hide
    const attendeeChatContainerEl = document.querySelector(
      ".attendee-chat-region-container"
    );
    const chatRegionContainerEl = document.querySelector(
      ".chat-region-container"
    );
    if (
      !attendeeRegionContainerEl.classList.contains("hide") ||
      !chatRegionContainerEl.classList.contains("hide")
    ) {
      attendeeChatContainerEl.classList.remove("width-zero");
    } else {
      attendeeChatContainerEl.classList.add("width-zero");
    }
  };

  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img
          className="attendee-btn-img function-btn-img"
          src={AttendeeImg}
          alt=""
        />
        <div className="function-btn-name">
          {isAttendee ? "Hide attendees" : "Show attendees"}
        </div>
      </div>
    </div>
  );
};

export default ShowAttendeesBtn;
