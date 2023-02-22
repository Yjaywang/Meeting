import React from "react";

const CreateBtn = ({ onClickHandler, BtnText, host = false }) => {
  const btnClassName = host ? "create-room" : "join-room";

  return (
    <div className={btnClassName} onClick={onClickHandler}>
      {BtnText}
    </div>
  );
};

export default CreateBtn;
