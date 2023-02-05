import React from "react";
import InputTemplate from "../../components/InputTemplate";

const JoinInput = (props) => {
  const { roomId, setRoomId, username, setUsername, isHost } = props; //some of them come from parent usestate

  const roomIdHandler = (e) => {
    setRoomId(e.target.value);
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="template-input-container">
      {!isHost && (
        <>
          <InputTemplate
            value={roomId}
            onchangeHandler={roomIdHandler}
            spanValue={"Room Id"}
            type={"text"}
          />
        </>
      )}
      <>
        <InputTemplate
          value={username}
          onchangeHandler={usernameHandler}
          spanValue={"Username"}
          type={"text"}
        />
      </>
    </div>
  );
};

export default JoinInput;
