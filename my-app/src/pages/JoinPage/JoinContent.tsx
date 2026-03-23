import React, { useState, useEffect } from "react";
import JoinInput from "./JoinInput";
import { connect } from "react-redux";
import JoinBtns from "./JoinBtns";
import { useHistory } from "react-router-dom";
import { getRoomInfoApi } from "../../utils/fetchRoomInfoApi";
import { setRoomId, setUsername } from "../../store/actions";
import ErrorMessages from "../../components/ErrorMessages";
import * as validFormat from "../../utils/validFormat";
import { RootState, AppAction } from "../../types/redux";
import { Dispatch } from "redux";

interface JoinContentProps {
  newIsHost: string | null;
  setRoomIdAction: (roomId: string) => void;
  setUsernameAction: (username: string) => void;
  defaultUsername: string;
  roomId: string;
}

const JoinContent: React.FC<JoinContentProps> = (props) => {
  const {
    newIsHost,
    setRoomIdAction,
    setUsernameAction,
    defaultUsername,
    roomId,
  } = props;
  const [newRoomId, setNewRoomId] = useState<string>(roomId);
  const [newUsername, setNewUsername] = useState<string>(defaultUsername);
  const [joinErr, setJoinErr] = useState<string>("");
  const history = useHistory();

  const joinMeeting = async () => {
    try {
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
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const hostMeeting = () => {
    history.push("/preview");
  };

  const joinHandler = async () => {
    try {
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
    } catch (error) {
      console.log("error: ", error);
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
          usernameInputEl?.classList.remove("sign-in-up-format-fail");
          usernameInputEl?.classList.add("sign-in-up-format-success");
        }
      }
    } else {
      const usernameInputEl =
        usernameInputContainerEl?.querySelector(".template-input");
      const roomIdInoutEl =
        roomIdInputContainerEl?.querySelector(".template-input");

      if (validFormat.validateUsername(newUsername)) {
        usernameInputEl?.classList.remove("sign-in-up-format-fail");
        usernameInputEl?.classList.add("sign-in-up-format-success");
      }
      if (newRoomId) {
        roomIdInoutEl?.classList.remove("sign-in-up-format-fail");
        roomIdInoutEl?.classList.add("sign-in-up-format-success");
      }
      if (newRoomId && validFormat.validateUsername(newUsername)) {
        joinBtnEl?.classList.remove("btn-not-allowed");
      }
    }
  }, []);

  function keyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
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

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
  return {
    setRoomIdAction: (newRoomId: string) => dispatch(setRoomId(newRoomId)),
    setUsernameAction: (newUsername: string) => dispatch(setUsername(newUsername)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinContent);
