import React from "react";
import AttendeesContent from "./AttendeesContent";
import AttendeeTitle from "./AttendeeTitle";
import ChatRegion from "./ChatRegion/ChatRegion";

interface AttendeesRegionProps {
  isAttendee: boolean;
  isChat: boolean;
}

const AttendeesRegion: React.FC<AttendeesRegionProps> = ({ isAttendee, isChat }) => {
  return (
    <>
      <div className={`flex-1 overflow-auto border-b-2 border-muted box-border ${isAttendee ? "" : "hidden"}`}>
        <AttendeeTitle />
        <AttendeesContent />
      </div>
      <div className={`flex-1 overflow-auto ${isChat ? "" : "hidden"}`}>
        <ChatRegion />
      </div>
    </>
  );
};

export default AttendeesRegion;
