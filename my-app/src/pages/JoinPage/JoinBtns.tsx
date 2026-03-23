import React from "react";
import { useHistory } from "react-router-dom";

interface BtnProps {
  text: string;
  handler: () => void;
  cancel?: boolean;
}

const Btn: React.FC<BtnProps> = ({ text, handler, cancel = true }) => {
  const btnClassName = cancel ? "join-cancel-btn" : "join-btn btn-not-allowed";
  return (
    <div onClick={handler} className={btnClassName}>
      {text}
    </div>
  );
};

interface JoinBtnsProps {
  newIsHost: string | null;
  handler: () => void;
}

const JoinBtns: React.FC<JoinBtnsProps> = ({ newIsHost, handler }) => {
  //handler name need to be same as Btn defined.... or it will pass undefined
  const btnText = newIsHost ? "Host" : "Join";
  const history = useHistory();
  const cancelHandler = () => {
    history.push("/");
  };
  return (
    <div className="join-btn-container">
      <Btn text={btnText} handler={handler} cancel={false} />
      <Btn text="Cancel" handler={cancelHandler} cancel={true} />
    </div>
  );
};

export default JoinBtns;
