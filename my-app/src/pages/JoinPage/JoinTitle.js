import React from "react";

const JoinTitle = ({ isHost }) => {
  const titleText = isHost ? "Host a meeting" : "Join the meeting";
  return <div className="join-title">{titleText}</div>;
};

export default JoinTitle;
