import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import { connect } from "react-redux";
import PeopleImg from "../../../assets/images/people.svg";
import { RootState } from "../../../types/redux";
import { IAttendee } from "../../../types/models";

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

interface AttendeesProps {
  attendees: IAttendee[];
  isMuted: boolean;
  isCamOff: boolean;
  selfSocketId: string;
}

const Attendees: React.FC<AttendeesProps> = ({ attendees, isMuted, isCamOff, selfSocketId }) => {
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

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(Attendees);
