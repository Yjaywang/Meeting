import React from "react";
import CreateBtn from "./CreateBtn";
import { useHistory } from "react-router-dom";

const CreateBtns = () => {
  let history = useHistory();

  const joinRoom = () => {
    history.push("/join");
  };

  const hostMeeting = () => {
    history.push("/join?host=true");
  };

  return (
    <div className="click-btns-container">
      <CreateBtn BtnText="Host Meeting" onClickHandler={hostMeeting} host />
      <CreateBtn BtnText="Join Meeting" onClickHandler={joinRoom} />
    </div>
  );
};

export default CreateBtns;