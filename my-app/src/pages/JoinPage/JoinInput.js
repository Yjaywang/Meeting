import React from "react";
import InputTemplate from "../../components/InputTemplate";
import * as validFormat from "../../utils/validFormat";

const JoinInput = (props) => {
  const { roomId, setRoomId, newUsername, setNewUsername, isHost } = props; //some of them come from parent usestate

  const roomIdHandler = (e) => {
    setRoomId(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //roomId valid
    const roomIdInputContainerEl = document.querySelector(".input-roomId");
    const joinBtnEl = document.querySelector(".join-btn");
    if (roomIdInputContainerEl) {
      const roomIdInoutEl =
        roomIdInputContainerEl.querySelector(".template-input");
      const failMessageEl = roomIdInputContainerEl.querySelector(
        ".sign-in-up-fail-message"
      );
      // for host bypass
      if (isHost) {
        joinBtnEl.classList.remove("btn-not-allowed");
        return;
      }
      if (e.target.value === "") {
        roomIdInoutEl.classList.add("sign-in-up-format-fail");
        roomIdInoutEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        joinBtnEl.classList.add("btn-not-allowed");
      } else {
        roomIdInoutEl.classList.remove("sign-in-up-format-fail");
        roomIdInoutEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (validFormat.validateUsername(newUsername)) {
          joinBtnEl.classList.remove("btn-not-allowed");
        }
      }
    }
  };

  const usernameHandler = (e) => {
    setNewUsername(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //username valid
    const usernameInputContainerEl = document.querySelector(".input-username");
    const joinBtnEl = document.querySelector(".join-btn");
    if (usernameInputContainerEl) {
      const usernameInputEl =
        usernameInputContainerEl.querySelector(".template-input");
      const failMessageEl = usernameInputContainerEl.querySelector(
        ".sign-in-up-fail-message"
      );
      if (!validFormat.validateUsername(e.target.value)) {
        usernameInputEl.classList.add("sign-in-up-format-fail");
        usernameInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        joinBtnEl.classList.add("btn-not-allowed");
      } else {
        usernameInputEl.classList.remove("sign-in-up-format-fail");
        usernameInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (isHost || roomId !== "") {
          joinBtnEl.classList.remove("btn-not-allowed");
        }
      }
    }
  };

  return (
    <div className="template-input-container join-input-container">
      {!isHost && (
        <div className="input-roomId">
          <InputTemplate
            value={roomId}
            onchangeHandler={roomIdHandler}
            spanValue={"Room Id"}
            type={"text"}
          />
          <div className="join-roomID-inout-error-message sign-in-up-fail-message non-vis">
            roomId empty
          </div>
        </div>
      )}
      <div className="input-username">
        <InputTemplate
          value={newUsername}
          onchangeHandler={usernameHandler}
          spanValue={"Username"}
          type={"text"}
        />
        <div className="join-username-input-error-message sign-in-up-fail-message non-vis">
          1~8 characters long
        </div>
      </div>
    </div>
  );
};

export default JoinInput;
