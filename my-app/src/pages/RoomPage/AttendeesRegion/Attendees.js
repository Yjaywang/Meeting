import React from "react";
import AttendeeBtns from "./AttendeeBtns";

const test = [
  {
    username: "hhhh",
  },
  {
    username: "aaaa",
  },
  {
    username: "ssss",
  },
];

const Attendee = ({ username, attendee }) => {
  return (
    <>
      <div className="attendee">{username}</div>
      <AttendeeBtns />
    </>
  );
};
const Attendees = () => {
  return (
    <div className="attendee-container">
      {test.map((attendee, index) => {
        return (
          <Attendee key={attendee.username} username={attendee.username} />
        );
      })}
    </div>
  );
};

export default Attendees;
