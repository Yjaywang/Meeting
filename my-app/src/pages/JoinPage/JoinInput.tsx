import React, { useState } from "react";
import InputTemplate from "../../components/InputTemplate";
import * as validFormat from "../../utils/validFormat";

interface JoinInputProps {
  newRoomId: string;
  setNewRoomId: React.Dispatch<React.SetStateAction<string>>;
  newUsername: string;
  setNewUsername: React.Dispatch<React.SetStateAction<string>>;
  newIsHost?: string | null;
  keyDownHandler: (event: React.KeyboardEvent) => void;
}

const JoinInput: React.FC<JoinInputProps> = ({ newRoomId, setNewRoomId, newUsername, setNewUsername, newIsHost, keyDownHandler }) => {
  const [roomIdTouched, setRoomIdTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  const usernameValid = validFormat.validateUsername(newUsername);
  const roomIdValid = !!newRoomId;

  function getInputClassName(touched: boolean, valid: boolean) {
    if (!touched) return "";
    return valid ? "!border-success" : "!border-danger";
  }

  const roomIdHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoomId(e.target.value);
    setRoomIdTouched(true);
  };

  const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
    setUsernameTouched(true);
  };

  return (
    <div className="flex flex-col h-[100px] justify-between w-full items-center mt-2.5 mb-20">
      {!newIsHost && (
        <div>
          <InputTemplate
            value={newRoomId}
            onchangeHandler={roomIdHandler}
            spanValue={"Room Id"}
            type={"text"}
            keyDownHandler={keyDownHandler}
            inputClassName={getInputClassName(roomIdTouched, roomIdValid)}
          />
          <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!roomIdTouched || roomIdValid ? "invisible" : ""}`}>
            roomId empty
          </div>
        </div>
      )}
      <div>
        <InputTemplate
          value={newUsername}
          onchangeHandler={usernameHandler}
          spanValue={"Username"}
          type={"text"}
          keyDownHandler={keyDownHandler}
          inputClassName={getInputClassName(usernameTouched, usernameValid)}
        />
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!usernameTouched || usernameValid ? "invisible" : ""}`}>
          1~8 characters long
        </div>
      </div>
    </div>
  );
};

export default JoinInput;
