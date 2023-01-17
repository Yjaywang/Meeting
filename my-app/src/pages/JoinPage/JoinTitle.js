import React from "react";

const JoinTitle = ({ isHost }) => {
  const titleText = isHost ? "host a meeting" : "join the meeting";
  return <div className="join-title">{titleText}</div>;
};

export default JoinTitle;
