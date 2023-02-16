import React, { useState } from "react";
import InputTemplate from "../../../components/InputTemplate";
import closeEyeImg from "../../../assets/images/close_eye.svg";
import openEyeImg from "../../../assets/images/open_eye.svg";
import * as validFormat from "../../../utils/validFormat";

const PasswordInput = (props) => {
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    checkPassword,
    setCheckPassword,
  } = props;

  const [seeOldPW, setSeeOldPW] = useState(false);
  const [seeNewPW, setSeeNewPW] = useState(false);
  const [seeCheckPW, setSeeCheckPW] = useState(false);

  function oldPasswordHandler(e) {
    setOldPassword(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //password valid
    const pwOldInputContainerEl = document.querySelector(
      ".change-pw-old-input-container"
    );
    const changePwBtnEl = document.querySelector(".change-pw-region-II");
    if (pwOldInputContainerEl) {
      const oldPwInputEl =
        pwOldInputContainerEl.querySelector(".template-input");
      const failMessageEl = pwOldInputContainerEl.querySelector(
        ".change-old-fail-message"
      );
      if (!validFormat.validatePassword(e.target.value)) {
        oldPwInputEl.classList.add("sign-in-up-format-fail");
        oldPwInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        changePwBtnEl.classList.add("btn-not-allowed");
      } else {
        oldPwInputEl.classList.remove("sign-in-up-format-fail");
        oldPwInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (
          validFormat.validatePassword(newPassword) &&
          validFormat.validatePassword(checkPassword)
        ) {
          changePwBtnEl.classList.remove("btn-not-allowed");
        }
      }
    }
  }
  function newPasswordHandler(e) {
    setNewPassword(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //password valid
    const pwNewInputContainerEl = document.querySelector(
      ".change-pw-new-input-container"
    );
    const changePwBtnEl = document.querySelector(".change-pw-region-II");
    if (pwNewInputContainerEl) {
      const newPwInputEl =
        pwNewInputContainerEl.querySelector(".template-input");
      const failMessageEl = pwNewInputContainerEl.querySelector(
        ".change-new-fail-message"
      );
      const pwCheckInputContainerEl = document.querySelector(
        ".change-pw-check-input-container"
      );
      const checkPwInputEl =
        pwCheckInputContainerEl.querySelector(".template-input");
      const sameFailMessageEl = pwCheckInputContainerEl.querySelector(
        ".change-same-fail-message"
      );
      if (!validFormat.validatePassword(e.target.value)) {
        newPwInputEl.classList.add("sign-in-up-format-fail");
        newPwInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        changePwBtnEl.classList.add("btn-not-allowed");
      } else {
        newPwInputEl.classList.remove("sign-in-up-format-fail");
        newPwInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (!validFormat.validateCheckPw(checkPassword, e.target.value)) {
          checkPwInputEl.classList.add("sign-in-up-format-fail");
          checkPwInputEl.classList.remove("sign-in-up-format-success");
          sameFailMessageEl.classList.remove("non-vis");
        } else {
          checkPwInputEl.classList.remove("sign-in-up-format-fail");
          checkPwInputEl.classList.add("sign-in-up-format-success");
          sameFailMessageEl.classList.add("non-vis");

          if (
            validFormat.validatePassword(oldPassword) &&
            validFormat.validatePassword(checkPassword)
          ) {
            changePwBtnEl.classList.remove("btn-not-allowed");
          }
        }
      }
    }
  }
  function checkPasswordHandler(e) {
    setCheckPassword(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //password valid
    const pwCheckInputContainerEl = document.querySelector(
      ".change-pw-check-input-container"
    );
    const changePwBtnEl = document.querySelector(".change-pw-region-II");
    if (pwCheckInputContainerEl) {
      const checkPwInputEl =
        pwCheckInputContainerEl.querySelector(".template-input");
      const failMessageEl = pwCheckInputContainerEl.querySelector(
        ".change-check-fail-message"
      );
      const sameFailMessageEl = pwCheckInputContainerEl.querySelector(
        ".change-same-fail-message"
      );
      if (!validFormat.validatePassword(e.target.value)) {
        checkPwInputEl.classList.add("sign-in-up-format-fail");
        checkPwInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        failMessageEl.classList.remove("hide");
        changePwBtnEl.classList.add("btn-not-allowed");
      } else {
        failMessageEl.classList.add("hide");
        // failMessageEl.classList.add("non-vis");
        if (!validFormat.validateCheckPw(newPassword, e.target.value)) {
          checkPwInputEl.classList.add("sign-in-up-format-fail");
          checkPwInputEl.classList.remove("sign-in-up-format-success");
          sameFailMessageEl.classList.remove("non-vis");
        } else {
          checkPwInputEl.classList.remove("sign-in-up-format-fail");
          checkPwInputEl.classList.add("sign-in-up-format-success");
          sameFailMessageEl.classList.add("non-vis");
          if (
            validFormat.validatePassword(oldPassword) &&
            validFormat.validatePassword(newPassword)
          ) {
            changePwBtnEl.classList.remove("btn-not-allowed");
          }
        }
      }
    }
  }
  function toggleSeeOldPWHandler() {
    const pwOldInputContainerEl = document.querySelector(
      ".change-pw-old-input-container"
    );
    if (pwOldInputContainerEl) {
      const passwordInputEl =
        pwOldInputContainerEl.querySelector(".template-input");
      if (!seeOldPW) {
        passwordInputEl.type = "text";
      } else {
        passwordInputEl.type = "password";
      }
    }
    setSeeOldPW(!seeOldPW);
  }
  function toggleSeeNewPWHandler() {
    const pwNewInputContainerEl = document.querySelector(
      ".change-pw-new-input-container"
    );
    if (pwNewInputContainerEl) {
      const passwordInputEl =
        pwNewInputContainerEl.querySelector(".template-input");
      if (!seeNewPW) {
        passwordInputEl.type = "text";
      } else {
        passwordInputEl.type = "password";
      }
    }
    setSeeNewPW(!seeNewPW);
  }
  function toggleSeeCheckPWHandler() {
    const pwCheckInputContainerEl = document.querySelector(
      ".change-pw-check-input-container"
    );
    if (pwCheckInputContainerEl) {
      const passwordInputEl =
        pwCheckInputContainerEl.querySelector(".template-input");
      if (!seeCheckPW) {
        passwordInputEl.type = "text";
      } else {
        passwordInputEl.type = "password";
      }
    }
    setSeeCheckPW(!seeCheckPW);
  }
  return (
    <div>
      <div className="change-pw-old-input-container">
        <InputTemplate
          value={oldPassword}
          onchangeHandler={oldPasswordHandler}
          spanValue={"previous password"}
          type={"password"}
        />
        {seeOldPW ? (
          <img
            src={openEyeImg}
            className="change-PW-img"
            alt=""
            onClick={toggleSeeOldPWHandler}
          />
        ) : (
          <img
            src={closeEyeImg}
            className="change-PW-img"
            alt=""
            onClick={toggleSeeOldPWHandler}
          />
        )}
        <div className="change-old-fail-message non-vis sign-in-up-fail-message">
          at least 8 characters of numbers and letters
        </div>
      </div>
      <div className="change-pw-new-input-container">
        <InputTemplate
          value={newPassword}
          onchangeHandler={newPasswordHandler}
          spanValue={"new password"}
          type={"password"}
        />
        {seeNewPW ? (
          <img
            src={openEyeImg}
            className="change-PW-img"
            alt=""
            onClick={toggleSeeNewPWHandler}
          />
        ) : (
          <img
            src={closeEyeImg}
            className="change-PW-img"
            alt=""
            onClick={toggleSeeNewPWHandler}
          />
        )}
        <div className="change-new-fail-message non-vis sign-in-up-fail-message">
          at least 8 characters of numbers and letters
        </div>
      </div>
      <div className="change-pw-check-input-container">
        <InputTemplate
          value={checkPassword}
          onchangeHandler={checkPasswordHandler}
          spanValue={"confirm password"}
          type={"password"}
        />
        {seeCheckPW ? (
          <img
            src={openEyeImg}
            className="change-PW-img"
            alt=""
            onClick={toggleSeeCheckPWHandler}
          />
        ) : (
          <img
            src={closeEyeImg}
            className="change-PW-img"
            alt=""
            onClick={toggleSeeCheckPWHandler}
          />
        )}
        <div className="change-check-fail-message non-vis hide sign-in-up-fail-message">
          at least 8 characters of numbers and letters
        </div>
        <div className="change-same-fail-message non-vis sign-in-up-fail-message">
          new and confirm password not the same
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
