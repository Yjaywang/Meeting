import React from "react";
import { useHistory } from "react-router-dom";

const Btn = ({ text, handler, cancel = true }) => {
  const btnClassName = cancel ? "join-cancel-btn" : "join-btn";
  return (
    <div onClick={handler} className={btnClassName}>
      {text}
    </div>
  );
};

const JoinBtns = ({ isHost, handler }) => {
  //handler name need to be same as Btn defined.... or it will pass undefined
  const btnText = isHost ? "Host" : "Join";
  const history = useHistory();
  const cancelHandler = () => {
    history.push("/");
  };
  return (
    <div className="join-btn-container">
      <Btn text={btnText} handler={handler} />
      <Btn text="Cancel" handler={cancelHandler} cancel />
    </div>
  );
};

export default JoinBtns;
