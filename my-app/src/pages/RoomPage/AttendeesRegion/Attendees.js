import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import { connect } from "react-redux";
import PeopleImg from "../../../assets/images/people.svg";
const { v4: uuidv4 } = require("uuid");

const Attendee = ({
  username,
  isHost,
  socketId,
  isShare,
  isRecording,
  avatar,
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
      <AttendeeBtns socketId={socketId} />
    </div>
  );
};
const Attendees = ({ attendees, isHost, avatar }) => {
  return (
    <div className="attendees-box">
      {attendees.map((attendee, index) => {
        return (
          <Attendee
            key={`${attendee.username}${uuidv4()}`}
            username={attendee.username}
            isHost={attendee.isHost}
            socketId={attendee.socketId}
            avatar={avatar}
          />
        );
      })}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(Attendees);
