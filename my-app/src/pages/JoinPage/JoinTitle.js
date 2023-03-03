import React from "react";

const JoinTitle = ({ newIsHost }) => {
  const titleText = newIsHost ? "Host a meeting" : "Join the meeting";
  return <div className="join-title">{titleText}</div>;
};

export default JoinTitle;
