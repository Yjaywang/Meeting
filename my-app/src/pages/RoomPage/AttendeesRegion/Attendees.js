import React from "react";
import AttendeeBtns from "./AttendeeBtns";
import { connect } from "react-redux";

const Attendee = ({ username }) => {
  return (
    <>
      <div className="attendee">{username}</div>
      <AttendeeBtns />
    </>
  );
};
const Attendees = ({ attendees }) => {
  console.log(attendees);
  return (
    <div className="attendee-container">
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
