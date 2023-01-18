import { React, useState } from "react";
import JoinInput from "./JoinInput";
import { connect } from "react-redux";
import JoinBtns from "./JoinBtns";
import JoinErrors from "./JoinErrors";
import { useHistory } from "react-router-dom";
import { getRoomInfo } from "../../utils/getRoomInfo";

const JoinContent = (props) => {
  const { isHost } = props;
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joinErr, setJoinErr] = useState("");
  const history = useHistory();

  const joinMeeting = async () => {
    const response = await getRoomInfo(roomId);
    const { exist, join } = response;
    if (exist) {
      if (!join) {
        setJoinErr("Meeting is full, please check with host");
      } else {
        history.push("/room");
      }
    } else {
      setJoinErr("Meeting ID not exist!");
    }
  };

  const hostMeeting = () => {
    history.push("/room");
  };

  const joinHandler = () => {
    // if (isHost) {
    //   hostMeeting();
    // } else {
    //   await joinMeeting();
    // }
    console.log("test");
  };

  return (
    <>
      <JoinInput
        roomId={roomId}
        setRoomId={setRoomId}
        username={username}
        setUsername={setUsername}
        isHost={isHost}
      />
      <JoinBtns handler={joinHandler} isHost={isHost} />

      <JoinErrors errMsg={joinErr} />
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(JoinContent);
