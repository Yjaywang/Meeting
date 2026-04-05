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
    <div className="attendee-container" id={`attendee-container-${socketId}`}>
      <div className="attendee-avatar-container">
        <img
          className="attendee-avatar"
          src={avatar ? avatar : PeopleImg}
          alt=""
          id={`attendee-avatar-${socketId}`}
        />
        <div
          className="attendee-recording-status recording-circle hide"
          id={`attendee-recording-${socketId}`}
        ></div>
        <div className="attendee" id={`attendee-${socketId}`}>
          {username}
        </div>

        {isHost && (
          <span
            className="attendee-host-status"
            id={`attendee-host-${socketId}`}
          >
            (Host)
          </span>
        )}
        <span
          className="attendee-share-status"
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
    <div className="attendees-box">
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
