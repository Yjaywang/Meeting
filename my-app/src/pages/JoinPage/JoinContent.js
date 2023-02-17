import { React, useState, useEffect } from "react";
import JoinInput from "./JoinInput";
import { connect } from "react-redux";
import JoinBtns from "./JoinBtns";
import { useHistory } from "react-router-dom";
import { getRoomInfoApi } from "../../utils/fetchRoomInfoApi";
import { setRoomId, setUsername } from "../../store/actions";
import ErrorMessages from "../../components/ErrorMessages";
import * as validFormat from "../../utils/validFormat";

const JoinContent = (props) => {
  const { isHost, setRoomIdAction, setUsernameAction, username } = props;
  const [roomId, setRoomId] = useState("");
  const [newUsername, setNewUsername] = useState(username);
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
    if (!validFormat.validateUsername(newUsername)) {
      return;
    }
    if (roomId === "" && !isHost) {
      return;
    }
    setUsernameAction(newUsername);
    if (isHost) {
      hostMeeting();
    } else {
      await joinMeeting();
    }
  };

  useEffect(() => {
    const joinBtnEl = document.querySelector(".join-btn");
    const usernameInputContainerEl = document.querySelector(".input-username");
    const roomIdInputContainerEl = document.querySelector(".input-roomId");

    if (isHost) {
      if (joinBtnEl && usernameInputContainerEl) {
        const usernameInputEl =
          usernameInputContainerEl.querySelector(".template-input");
        if (validFormat.validateUsername(newUsername)) {
          joinBtnEl.classList.remove("btn-not-allowed");
          usernameInputEl.classList.remove("sign-in-up-format-fail");
          usernameInputEl.classList.add("sign-in-up-format-success");
        }
      }
    } else {
      const usernameInputEl =
        usernameInputContainerEl.querySelector(".template-input");
      const roomIdInoutEl =
        roomIdInputContainerEl.querySelector(".template-input");

      if (validFormat.validateUsername(newUsername)) {
        usernameInputEl.classList.remove("sign-in-up-format-fail");
        usernameInputEl.classList.add("sign-in-up-format-success");
      }
      if (roomId !== "") {
        roomIdInoutEl.classList.remove("sign-in-up-format-fail");
        roomIdInoutEl.classList.add("sign-in-up-format-success");
      }
      if (roomId !== "" && validFormat.validateUsername) {
        joinBtnEl.classList.remove("btn-not-allowed");
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
      <div className="join-error-message">
        <ErrorMessages errMsg={joinErr} />
      </div>
      <JoinBtns handler={joinHandler} isHost={isHost} />
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
