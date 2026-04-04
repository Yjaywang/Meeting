import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import PeopleImg from "../../../assets/images/people.svg";
import { useAppSelector } from "../../../store/hooks";
import { selectAttendees, selectPeersMap } from "../../../store/selectors";

const Attendees: React.FC = () => {
  const attendees = useAppSelector(selectAttendees);
  const peersMap = useAppSelector(selectPeersMap);

  return (
    <div className="h-[calc(100%-30px)] overflow-auto custom-scrollbar">
      {attendees.map((attendee) => {
        const peer = peersMap[attendee.socketId];
        return (
          <div
            key={attendee.socketId}
            className="flex justify-between px-2.5 pb-[5px]"
          >
            <div className="flex gap-2.5 items-center">
              <img
                className="h-[25px] object-cover rounded-full"
                src={attendee.avatar || PeopleImg}
                alt=""
              />
              {peer?.isRecording && (
                <div className="w-2.5 h-2.5 rounded-full bg-danger animate-blink" />
              )}
              <div>{attendee.username}</div>
              {attendee.isHost && <span>(Host)</span>}
              {peer?.isShare && <span>(sharing)</span>}
            </div>
            <AttendeeBtns
              isMuted={peer?.isMuted ?? false}
              isCamOff={peer?.isCamOff ?? false}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Attendees;
