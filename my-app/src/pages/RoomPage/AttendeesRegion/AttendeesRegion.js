import React from "react";
import AttendeesContent from "./AttendeesContent";
import AttendeeTitle from "./AttendeeTitle";
import ChatRegion from "./ChatRegion/ChatRegion";
import GrantAccessBtns from "./GrantAccessBtns";
import "./AttendeesRegion.css";

const AttendeesRegion = () => {
  return (
    <>
      <div className="attendee-region-container hide">
        <AttendeeTitle />
        <AttendeesContent />
        <GrantAccessBtns />
      </div>
      <div className="chat-region-container hide">
        <ChatRegion />
      </div>
    </>
  );
};

export default AttendeesRegion;
