import React from "react";

const InputTemplate = ({ value, handler, spanValue }) => {
  return (
    <div className="join-input-group">
      <label className="join-input-filled">
        <input
          value={value}
          onChange={handler}
          className="join-input"
          required
        />
        <span className="join-placeholder">{spanValue}</span>
      </label>
    </div>
  );
};

const JoinInput = (props) => {
  const { roomId, setRoomId, username, setUsername, isHost } = props; //some of them come from parent usestate

  const roomIdHandler = (e) => {
    setRoomId(e.target.value);
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="join-input-container">
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
