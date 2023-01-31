import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import { connect } from "react-redux";
import PeopleImg from "../../../assets/images/people.svg";

const Attendee = ({ username, isHost, socketId }) => {
  return (
    <div className="attendee-container" id={`attendee-container-${socketId}`}>
      <div className="attendee-avatar-container">
        <img
          className="attendee-avatar"
          src={PeopleImg}
          alt=""
          id={`attendee-avatar-${socketId}`}
        />
        <div className="attendee" id={`attendee-${socketId}`}>
          {username}
        </div>

        {isHost && <span>(Host)</span>}
      </div>
      <AttendeeBtns socketId={socketId} />
    </div>
  );
};
const Attendees = ({ attendees, isHost }) => {
  return (
    <div className="attendees-box">
      {attendees.map((attendee, index) => {
        return (
          <Attendee
            key={attendee.username}
            username={attendee.username}
            isHost={attendee.isHost}
            socketId={attendee.socketId}
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
