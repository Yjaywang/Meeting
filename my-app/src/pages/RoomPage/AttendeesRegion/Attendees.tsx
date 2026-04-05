import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import PeopleImg from "../../../assets/images/people.svg";
import { IAttendee } from "../../../types/models";
import { useAppSelector } from "../../../store/hooks";

interface AttendeeProps {
  username: string;
  isHost: boolean;
  socketId: string;
  avatar: string;
  selfSocketId: string;
  isMuted: boolean;
  isCamOff: boolean;
}

const Attendee: React.FC<AttendeeProps> = ({
  username,
  isHost,
  socketId,
  avatar,
  selfSocketId,
  isMuted,
  isCamOff,
}) => {
  return (
    <div className="flex justify-between px-2.5 pb-[5px]" id={`attendee-container-${socketId}`}>
      <div className="flex gap-2.5 items-center">
        <img
          className="h-[25px] object-cover rounded-full"
          src={avatar ? avatar : PeopleImg}
          alt=""
          id={`attendee-avatar-${socketId}`}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-danger animate-blink hidden"
          id={`attendee-recording-${socketId}`}
        ></div>
        <div id={`attendee-${socketId}`}>
          {username}
        </div>

        {isHost && (
          <span
            id={`attendee-host-${socketId}`}
          >
            (Host)
          </span>
        )}
        <span
          id={`attendee-share-${socketId}`}
        ></span>
      </div>
      <AttendeeBtns
        socketId={socketId}
        selfSocketId={selfSocketId}
        isMuted={isMuted}
        isCamOff={isCamOff}
      />
    </div>
  );
};

const Attendees: React.FC = () => {
  const attendees = useAppSelector((state) => state.room.attendees);
  const isMuted = useAppSelector((state) => state.media.isMuted);
  const isCamOff = useAppSelector((state) => state.media.isCamOff);
  const selfSocketId = useAppSelector((state) => state.room.selfSocketId);
  return (
    <div className="h-[calc(100%-30px)] overflow-auto custom-scrollbar">
      {attendees.map((attendee, index) => {
        return (
          <Attendee
            key={`${attendee.socketId}`}
            username={attendee.username}
            isHost={attendee.isHost}
            socketId={attendee.socketId}
            avatar={attendee.avatar}
            selfSocketId={selfSocketId}
            isMuted={isMuted}
            isCamOff={isCamOff}
          />
        );
      })}
    </div>
  );
};

export default Attendees;
