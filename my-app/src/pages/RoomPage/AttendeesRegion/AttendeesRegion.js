import React from "react";
import AttendeesContent from "./AttendeesContent";
import AttendeeTitle from "./AttendeeTitle";
import ChatRegion from "./ChatRegion/ChatRegion";

const AttendeesRegion = () => {
  return (
    <>
      <div className="attendee-region-container hide">
        <AttendeeTitle />
        <AttendeesContent />
      </div>
      <div className="chat-region-container hide">
        <ChatRegion />
      </div>
    </>
  );
};

export default AttendeesRegion;
