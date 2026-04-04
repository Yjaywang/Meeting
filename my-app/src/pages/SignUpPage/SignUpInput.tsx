import React, { useState } from "react";
import InputTemplate from "../../components/InputTemplate";
import * as validFormat from "../../utils/validFormat";
import eyeCloseImg from "../../assets/images/close_eye.svg";
import eyeOpenImg from "../../assets/images/open_eye.svg";

interface SignUpInputProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  keyDownHandler: (event: React.KeyboardEvent) => void;
}

const SignUpInput: React.FC<SignUpInputProps> = ({ username, setUsername, email, setEmail, password, setPassword, keyDownHandler }) => {
  const [seePW, setSeePW] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const usernameValid = validFormat.validateUsername(username);
  const emailValid = validFormat.validateEmail(email);
  const passwordValid = validFormat.validatePassword(password);

  function getInputClassName(touched: boolean, valid: boolean) {
    if (!touched) return "";
    return valid ? "!border-success" : "!border-danger";
  }

  const usernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setUsernameTouched(true);
  };

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailTouched(true);
  };

  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
  };

  return (
    <div>
      <div>
        <InputTemplate
          value={username}
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
      <div>
        <InputTemplate
          value={email}
          onchangeHandler={emailHandler}
          spanValue={"Email"}
          type={"text"}
          keyDownHandler={keyDownHandler}
          inputClassName={getInputClassName(emailTouched, emailValid)}
        />
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!emailTouched || emailValid ? "invisible" : ""}`}>
          wrong email format
        </div>
      </div>
      <div className="relative">
        <InputTemplate
          value={password}
          onchangeHandler={passwordHandler}
          spanValue={"password"}
          type={seePW ? "text" : "password"}
          keyDownHandler={keyDownHandler}
          inputClassName={getInputClassName(passwordTouched, passwordValid)}
        />
        <img
          src={seePW ? eyeOpenImg : eyeCloseImg}
          className="w-[15px] absolute top-4 right-2.5 cursor-pointer"
          alt=""
          onClick={() => setSeePW(!seePW)}
        />
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!passwordTouched || passwordValid ? "invisible" : ""}`}>
          at least 8 characters of numbers and letters
        </div>
      </div>
    </div>
  );
};

export default SignUpInput;
