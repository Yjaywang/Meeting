import React, { useState } from "react";
import InputTemplate from "../../components/InputTemplate";
import * as validFormat from "../../utils/validFormat";
import eyeCloseImg from "../../assets/images/close_eye.svg";
import eyeOpenImg from "../../assets/images/open_eye.svg";

const SignUpInput = (props) => {
  const { username, setUsername, email, setEmail, password, setPassword } =
    props;

  const [seePW, setSeePW] = useState(false);

  const usernameHandler = (e) => {
    setUsername(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //username valid
    const usernameInputContainerEl = document.querySelector(
      ".sign-up-username-input-container"
    );
    const signInBtnEl = document.querySelector(".sign-up-btn");
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
        signInBtnEl.classList.add("btn-not-allowed");
      } else {
        usernameInputEl.classList.remove("sign-in-up-format-fail");
        usernameInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (
          validFormat.validatePassword(password) &&
          validFormat.validateEmail(email)
        ) {
          signInBtnEl.classList.remove("btn-not-allowed");
        }
      }
    }
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //email valid
    const emailInputContainerEl = document.querySelector(
      ".sign-up-email-input-container"
    );
    const signInBtnEl = document.querySelector(".sign-up-btn");
    if (emailInputContainerEl) {
      const emailInputEl =
        emailInputContainerEl.querySelector(".template-input");
      const failMessageEl = emailInputContainerEl.querySelector(
        ".sign-in-up-fail-message"
      );
      if (!validFormat.validateEmail(e.target.value)) {
        emailInputEl.classList.add("sign-in-up-format-fail");
        emailInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        signInBtnEl.classList.add("btn-not-allowed");
      } else {
        emailInputEl.classList.remove("sign-in-up-format-fail");
        emailInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (
          validFormat.validatePassword(password) &&
          validFormat.validateUsername(username)
        ) {
          signInBtnEl.classList.remove("btn-not-allowed");
        }
      }
    }
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);

    //remove err msg
    const errorMessageEl = document.querySelector(".error-message");
    if (errorMessageEl) {
      errorMessageEl.remove();
    }

    //password valid
    const emailInputContainerEl = document.querySelector(
      ".sign-up-password-input-container"
    );
    const signInBtnEl = document.querySelector(".sign-up-btn");
    if (emailInputContainerEl) {
      const emailInputEl =
        emailInputContainerEl.querySelector(".template-input");
      const failMessageEl = emailInputContainerEl.querySelector(
        ".sign-in-up-fail-message"
      );
      if (!validFormat.validatePassword(e.target.value)) {
        emailInputEl.classList.add("sign-in-up-format-fail");
        emailInputEl.classList.remove("sign-in-up-format-success");
        failMessageEl.classList.remove("non-vis");
        signInBtnEl.classList.add("btn-not-allowed");
      } else {
        emailInputEl.classList.remove("sign-in-up-format-fail");
        emailInputEl.classList.add("sign-in-up-format-success");
        failMessageEl.classList.add("non-vis");
        if (
          validFormat.validateEmail(email) &&
          validFormat.validateUsername(username)
        ) {
          signInBtnEl.classList.remove("btn-not-allowed");
        }
      }
    }
  };

  function toggleSeePWHandler() {
    const passwordInputContainerEl = document.querySelector(
      ".sign-up-password-input-container"
    );
    if (passwordInputContainerEl) {
      const passwordInputEl =
        passwordInputContainerEl.querySelector(".template-input");
      if (!seePW) {
        passwordInputEl.type = "text";
      } else {
        passwordInputEl.type = "password";
      }
    }
    setSeePW(!seePW);
  }
  return (
    <div>
      <div className="sign-up-username-input-container">
        <InputTemplate
          value={username}
          onchangeHandler={usernameHandler}
          spanValue={"Username"}
          type={"text"}
        />
        <div className="sign-in-up-fail-message non-vis">
          1~8 characters long
        </div>
      </div>
      <div className="sign-up-email-input-container">
        <InputTemplate
          value={email}
          onchangeHandler={emailHandler}
          spanValue={"Email"}
          type={"text"}
        />
        <div className="sign-in-up-fail-message non-vis">
          wrong email format
        </div>
      </div>
      <div className="sign-up-password-input-container">
        <InputTemplate
          value={password}
          onchangeHandler={passwordHandler}
          spanValue={"password"}
          type={"password"}
        />
        {seePW ? (
          <img
            src={eyeOpenImg}
            className="sign-in-up-PW-img"
            alt=""
            onClick={toggleSeePWHandler}
          />
        ) : (
          <img
            src={eyeCloseImg}
            className="sign-in-up-PW-img"
            alt=""
            onClick={toggleSeePWHandler}
          />
        )}
        <div className="sign-in-up-fail-message non-vis">
          at least 8 characters of numbers and letters
        </div>
      </div>
    </div>
  );
};

export default SignUpInput;
