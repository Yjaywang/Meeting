import React from "react";
import AttendeesContent from "./AttendeesContent";
import AttendeeTitle from "./AttendeeTitle";
import ChatRegion from "./ChatRegion/ChatRegion";
import GrantAccessBtns from "./GrantAccessBtns";

const AttendeesRegion = () => {
  return (
    <div>
      <div className="attendee-region-container">
        <AttendeeTitle />
        <AttendeesContent />
        <GrantAccessBtns />
      </div>
      <div className="chat-region-container">
        <ChatRegion />
      </div>
    </div>
  );
};

export default AttendeesRegion;
