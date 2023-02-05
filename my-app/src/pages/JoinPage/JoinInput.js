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
            handler={roomIdHandler}
            spanValue={"Room Id"}
          />
        </>
      )}
      <>
        <InputTemplate
          value={username}
          handler={usernameHandler}
          spanValue={"Username"}
        />
      </>
    </div>
  );
};

export default JoinInput;
