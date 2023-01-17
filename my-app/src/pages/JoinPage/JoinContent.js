import { React, useState } from "react";
import JoinInput from "./JoinInput";
import { connect } from "react-redux";

const JoinContent = (props) => {
  const { isHost } = props;
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  return (
    <>
      <JoinInput
        roomId={roomId}
        setRoomId={setRoomId}
        username={username}
        setUsername={setUsername}
        isHost={isHost}
      />
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(JoinContent);
