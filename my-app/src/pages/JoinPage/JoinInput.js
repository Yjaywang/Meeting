import React from "react";
import InputTemplate from "../../components/InputTemplate";

const JoinInput = (props) => {
  const { roomId, setRoomId, newUsername, setNewUsername, isHost } = props; //some of them come from parent usestate

  const roomIdHandler = (e) => {
    setRoomId(e.target.value);
  };

  const usernameHandler = (e) => {
    setNewUsername(e.target.value);
  };

  return (
    <div className="template-input-container join-input-container">
      {!isHost && (
        <div className="input-roomId">
          <InputTemplate
            value={roomId}
            onchangeHandler={roomIdHandler}
            spanValue={"Room Id"}
            type={"text"}
          />
        </div>
      )}
      <div className="input-username">
        <InputTemplate
          value={newUsername}
          onchangeHandler={usernameHandler}
          spanValue={"Username"}
          type={"text"}
        />
      </div>
    </div>
  );
};

export default JoinInput;
