import React, { useState, useEffect } from "react";
import JoinInput from "./JoinInput";
import JoinBtns from "./JoinBtns";
import { useNavigate } from "react-router-dom";
import { getRoomInfoApi } from "../../utils/fetchRoomInfoApi";
import { setRoomId, setUsername } from "../../store/actions";
import ErrorMessages from "../../components/ErrorMessages";
import * as validFormat from "../../utils/validFormat";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface JoinContentProps {
  newIsHost?: string | null;
}

const JoinContent: React.FC<JoinContentProps> = ({ newIsHost }) => {
  const dispatch = useAppDispatch();
  const defaultUsername = useAppSelector((state) => state.user.defaultUsername);
  const roomId = useAppSelector((state) => state.room.roomId);
  const [newRoomId, setNewRoomId] = useState(roomId);
  const [newUsername, setNewUsername] = useState(defaultUsername);
  const [joinErr, setJoinErr] = useState("");
  const navigate = useNavigate();

  const joinMeeting = async () => {
    try {
      const response = await getRoomInfoApi(newRoomId);
      const { exist, join } = response;
      if (exist) {
        if (!join) { setJoinErr("Meeting is full, please check with host"); }
        else { dispatch(setRoomId(newRoomId)); navigate("/preview"); }
      } else { setJoinErr("Meeting ID not exist!"); }
    } catch (error) { console.log("error: ", error); }
  };

  const hostMeeting = () => { navigate("/preview"); };

  const joinHandler = async () => {
    try {
      if (!validFormat.validateUsername(newUsername)) { return; }
      if (!newRoomId && !newIsHost) { return; }
      dispatch(setUsername(newUsername));
      if (newIsHost) { hostMeeting(); }
      else { await joinMeeting(); }
    } catch (error) { console.log("error: ", error); }
  };

  useEffect(() => {
    const joinBtnEl = document.querySelector(".join-btn");
    const usernameInputContainerEl = document.querySelector(".input-username");
    const roomIdInputContainerEl = document.querySelector(".input-roomId");

    if (newIsHost) {
      if (joinBtnEl && usernameInputContainerEl) {
        const usernameInputEl = usernameInputContainerEl.querySelector(".template-input");
        if (validFormat.validateUsername(newUsername)) {
          joinBtnEl.classList.remove("btn-not-allowed");
          usernameInputEl?.classList.remove("sign-in-up-format-fail");
          usernameInputEl?.classList.add("sign-in-up-format-success");
        }
      }
    } else {
      if (usernameInputContainerEl && roomIdInputContainerEl) {
        const usernameInputEl = usernameInputContainerEl.querySelector(".template-input");
        const roomIdInoutEl = roomIdInputContainerEl.querySelector(".template-input");
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
    }
  }, []);

  function keyDownHandler(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (newIsHost) { if (validFormat.validateUsername(newUsername)) { joinHandler(); } }
      else { if (validFormat.validateUsername(newUsername) && newRoomId) { joinHandler(); } }
    }
  }

  return (
    <>
      <JoinInput newRoomId={newRoomId} setNewRoomId={setNewRoomId} newUsername={newUsername} setNewUsername={setNewUsername} newIsHost={newIsHost} keyDownHandler={keyDownHandler} />
      <div className="join-error-message"><ErrorMessages errMsg={joinErr} /></div>
      <JoinBtns handler={joinHandler} newIsHost={newIsHost} />
    </>
  );
};

export default JoinContent;
