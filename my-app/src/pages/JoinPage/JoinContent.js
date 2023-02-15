import { React, useState, useEffect } from "react";
import JoinInput from "./JoinInput";
import { connect } from "react-redux";
import JoinBtns from "./JoinBtns";
import { useHistory } from "react-router-dom";
import { getRoomInfoApi } from "../../utils/fetchRoomInfoApi";
import { setRoomId, setUsername } from "../../store/actions";
import ErrorMessages from "../../components/ErrorMessages";

const JoinContent = (props) => {
  const { isHost, setRoomIdAction, setUsernameAction, username } = props;
  const [roomId, setRoomId] = useState("");
  const [newUsername, setNewUsername] = useState("");
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
    setUsernameAction(newUsername);
    if (!isHost) {
      if (!roomId) {
        setJoinErr("Room ID should not be empty");
        return;
      }
    }
    if (!newUsername) {
      setJoinErr("Username should not be empty");
      return;
    }
    if (isHost) {
      hostMeeting();
    } else {
      await joinMeeting();
    }
  };

  useEffect(() => {
    if (username) {
      const inputUsernameEl = document.querySelector(".input-username");
      if (inputUsernameEl) {
        const templateInputEl =
          inputUsernameEl.querySelector(".template-input");
        templateInputEl.value = username;
      }
    }
  }, []);
  return (
    <>
      <JoinInput
        roomId={roomId}
        setRoomId={setRoomId}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        isHost={isHost}
      />
      <JoinBtns handler={joinHandler} isHost={isHost} />
      <ErrorMessages errMsg={joinErr} />
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
    setUsernameAction: (newUsername) => dispatch(setUsername(newUsername)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinContent);
