import React from "react";

function InputTemplate({ value, placeholder, handler }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={handler}
      className="join-input"
    />
  );
}

const JoinInput = (props) => {
  const { roomId, setRoomId, username, setUsername, isHost } = props;

  const roomIdHandler = (e) => {
    setRoomId(e.target.value);
  };

  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="join-input-container">
      {!isHost && (
        <InputTemplate
          value={roomId}
          placeholder="Enter Room ID"
          onChange={roomIdHandler}
        />
      )}
      <InputTemplate
        value={username}
        placeholder="Enter Username"
        onChange={usernameHandler}
      />
    </div>
  );
};

export default JoinInput;
