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
  const {
    newIsHost,
    setRoomIdAction,
    setUsernameAction,
    defaultUsername,
    roomId,
  } = props;
  const [newRoomId, setNewRoomId] = useState(roomId);
  const [newUsername, setNewUsername] = useState(defaultUsername);
  const [joinErr, setJoinErr] = useState("");
  const history = useHistory();

  const joinMeeting = async () => {
    const response = await getRoomInfoApi(newRoomId);
    const { exist, join } = response;
    if (exist) {
      if (!join) {
        setJoinErr("Meeting is full, please check with host");
      } else {
        setRoomIdAction(newRoomId);
        history.push("/preview");
      }
    } else {
      setJoinErr("Meeting ID not exist!");
    }
  };

  const hostMeeting = () => {
    history.push("/preview");
  };

  const joinHandler = async () => {
    if (!validFormat.validateUsername(newUsername)) {
      return;
    }
    if (!newRoomId && !newIsHost) {
      return;
    }
    setUsernameAction(newUsername);
    if (newIsHost) {
      hostMeeting();
    } else {
      await joinMeeting();
    }
  };

  useEffect(() => {
    const joinBtnEl = document.querySelector(".join-btn");
    const usernameInputContainerEl = document.querySelector(".input-username");
    const roomIdInputContainerEl = document.querySelector(".input-roomId");

    if (newIsHost) {
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
      if (newRoomId) {
        roomIdInoutEl.classList.remove("sign-in-up-format-fail");
        roomIdInoutEl.classList.add("sign-in-up-format-success");
      }
      if (newRoomId && validFormat.validateUsername(newUsername)) {
        joinBtnEl.classList.remove("btn-not-allowed");
      }
    }
  }, []);

  function keyDownHandler(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (newIsHost) {
        if (validFormat.validateUsername(newUsername)) {
          joinHandler();
        }
      } else {
        if (validFormat.validateUsername(newUsername) && newRoomId) {
          joinHandler();
        }
      }
    }
  }
  return (
    <>
      <JoinInput
        newRoomId={newRoomId}
        setNewRoomId={setNewRoomId}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        newIsHost={newIsHost}
        keyDownHandler={keyDownHandler}
      />
      <div className="join-error-message">
        <ErrorMessages errMsg={joinErr} />
      </div>
      <JoinBtns handler={joinHandler} newIsHost={newIsHost} />
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
    setRoomIdAction: (newRoomId) => dispatch(setRoomId(newRoomId)),
    setUsernameAction: (newUsername) => dispatch(setUsername(newUsername)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinContent);
