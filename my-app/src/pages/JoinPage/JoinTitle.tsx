import React from "react";

interface JoinTitleProps {
  newIsHost?: string | null;
}

const JoinTitle: React.FC<JoinTitleProps> = ({ newIsHost }) => {
  const titleText = newIsHost ? "Host a meeting" : "Join the meeting";
  return <div className="font-bold text-2xl mt-[30px]">{titleText}</div>;
};

export default JoinTitle;
