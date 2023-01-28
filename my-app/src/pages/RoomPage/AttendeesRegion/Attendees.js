import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import { connect } from "react-redux";
import PeopleImg from "../../../assets/images/people.svg";

const Attendee = ({ username }) => {
  return (
    <div className="attendee-container">
      <div className="attendee-avatar-container">
        <img className="attendee-avatar" src={PeopleImg} alt="" />
        <div className="attendee">{username}</div>
      </div>
      <AttendeeBtns />
    </div>
  );
};
const Attendees = ({ attendees }) => {
  return (
    <div className="attendees-box">
      {attendees.map((attendee, index) => {
        return (
          <Attendee key={attendee.username} username={attendee.username} />
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
