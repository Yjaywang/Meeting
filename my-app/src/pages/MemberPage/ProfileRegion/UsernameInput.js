import React from "react";
import InputTemplate from "../../../components/InputTemplate";
import * as validFormat from "../../../utils/validFormat";

const UsernameInput = (props) => {
  const { newUsername, setNewUsername } = props;

  function newUsernameHandler(e) {
    setNewUsername(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //username valid
    const usernameInputContainerEl = document.querySelector(
      ".change-username-input-container"
    );
    const usernameBtnEl = document.querySelector(".basic-info-region-III");
    if (usernameInputContainerEl) {
      const usernameInputEl =
        usernameInputContainerEl.querySelector(".template-input");
      const failMessageEl = usernameInputContainerEl.querySelector(
        ".change-username-fail-message"
      );
      if (!validFormat.validateUsername(e.target.value)) {
        usernameInputEl.classList.add("sign-in-up-format-fail");
        usernameInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        usernameBtnEl.classList.add("btn-not-allowed");
      } else {
        usernameInputEl.classList.remove("sign-in-up-format-fail");
        usernameInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        usernameBtnEl.classList.remove("btn-not-allowed");
      }
    }
  }
  return (
    <div className="change-username-input-container">
      <InputTemplate
        value={newUsername}
        onchangeHandler={newUsernameHandler}
        spanValue={"new username"}
        type={"text"}
      />
      <div className="change-username-fail-message non-vis sign-in-up-fail-message">
        1~8 characters long
      </div>
    </div>
  );
};

export default UsernameInput;
