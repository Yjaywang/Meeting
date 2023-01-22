import { React, useState } from "react";
import JoinInput from "./JoinInput";
import { connect } from "react-redux";
import JoinBtns from "./JoinBtns";
import JoinErrors from "./JoinErrors";
import { useHistory } from "react-router-dom";
import { getRoomInfoApi } from "../../utils/getRoomInfoApi";
import { setRoomId, setUsername } from "../../store/actions";

const JoinContent = (props) => {
  const { isHost, setRoomIdAction, setUsernameAction } = props;
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joinErr, setJoinErr] = useState("");
  const history = useHistory();

  const joinMeeting = async () => {
    const response = await getRoomInfoApi(roomId);
    const { exist, join } = response;
    if (exist) {
      if (!join) {
        setJoinErr("Meeting is full, please check with host");
      } else {
        setRoomIdAction(roomId);
        history.push("/room");
      }
    } else {
      setJoinErr("Meeting ID not exist!");
    }
  };

  const hostMeeting = () => {
    history.push("/room");
  };

  const joinHandler = async () => {
    setUsernameAction(username);
    if (isHost) {
      hostMeeting();
    } else {
      await joinMeeting();
    }
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

const mapDispatchToProps = (dispatch) => {
  return {
    setRoomIdAction: (roomId) => dispatch(setRoomId(roomId)),
    setUsernameAction: (username) => dispatch(setUsername(username)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinContent);
