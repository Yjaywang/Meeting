import React from "react";

interface JoinTitleProps {
  newIsHost?: string | null;
}

const JoinTitle: React.FC<JoinTitleProps> = ({ newIsHost }) => {
  const titleText = newIsHost ? "Host a meeting" : "Join the meeting";
  return <div className="join-title">{titleText}</div>;
};

export default JoinTitle;
