import React, { useState } from "react";
import JoinInput from "./JoinInput";
import JoinBtns from "./JoinBtns";
import { useNavigate } from "react-router-dom";
import { getRoomInfoApi } from "../../utils/fetchRoomInfoApi";
import { setRoomId } from "../../store/slices/roomSlice";
import { setUsername } from "../../store/slices/userSlice";
import ErrorMessages from "../../components/ErrorMessages";
import * as validFormat from "../../utils/validFormat";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectDefaultUsername, selectRoomId } from "../../store/selectors";

interface JoinContentProps {
  newIsHost?: string | null;
}

const JoinContent: React.FC<JoinContentProps> = ({ newIsHost }) => {
  const dispatch = useAppDispatch();
  const defaultUsername = useAppSelector(selectDefaultUsername);
  const roomId = useAppSelector(selectRoomId);
  const [newRoomId, setNewRoomId] = useState(roomId);
  const [newUsername, setNewUsername] = useState(defaultUsername);
  const [joinErr, setJoinErr] = useState("");
  const navigate = useNavigate();

  const isFormValid = newIsHost
    ? validFormat.validateUsername(newUsername)
    : validFormat.validateUsername(newUsername) && !!newRoomId;

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
      if (!isFormValid) { return; }
      dispatch(setUsername(newUsername));
      if (newIsHost) { hostMeeting(); }
      else { await joinMeeting(); }
    } catch (error) { console.log("error: ", error); }
  };

  function keyDownHandler(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isFormValid) { joinHandler(); }
    }
  }

  return (
    <>
      <JoinInput newRoomId={newRoomId} setNewRoomId={setNewRoomId} newUsername={newUsername} setNewUsername={setNewUsername} newIsHost={newIsHost} keyDownHandler={keyDownHandler} />
      <div className="w-[244px]"><ErrorMessages errMsg={joinErr} /></div>
      <JoinBtns handler={joinHandler} newIsHost={newIsHost} disabled={!isFormValid} />
    </>
  );
};

export default JoinContent;
