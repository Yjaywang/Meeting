import React, { useState } from "react";
import InputTemplate from "../../../components/InputTemplate";
import closeEyeImg from "../../../assets/images/close_eye.svg";
import openEyeImg from "../../../assets/images/open_eye.svg";
import * as validFormat from "../../../utils/validFormat";

interface PasswordInputProps {
  oldPassword: string;
  setOldPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  checkPassword: string;
  setCheckPassword: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  checkPassword,
  setCheckPassword,
}) => {
  const [seeOldPW, setSeeOldPW] = useState<boolean>(false);
  const [seeNewPW, setSeeNewPW] = useState<boolean>(false);
  const [seeCheckPW, setSeeCheckPW] = useState<boolean>(false);
  const [oldTouched, setOldTouched] = useState(false);
  const [newTouched, setNewTouched] = useState(false);
  const [checkTouched, setCheckTouched] = useState(false);

  const oldValid = validFormat.validatePassword(oldPassword);
  const newValid = validFormat.validatePassword(newPassword);
  const checkValid = validFormat.validatePassword(checkPassword);
  const checkSame = validFormat.validateCheckPw(newPassword, checkPassword);

  function getInputClassName(touched: boolean, valid: boolean) {
    if (!touched) return "";
    return valid ? "!border-success" : "!border-danger";
  }

  function oldPasswordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setOldPassword(e.target.value);
    setOldTouched(true);
  }

  function newPasswordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
    setNewTouched(true);
  }

  function checkPasswordHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setCheckPassword(e.target.value);
    setCheckTouched(true);
  }

  return (
    <div>
      <div className="relative max-[500px]:w-[244px]">
        <InputTemplate
          value={oldPassword}
          onchangeHandler={oldPasswordHandler}
          spanValue={"previous password"}
          type={seeOldPW ? "text" : "password"}
          inputClassName={getInputClassName(oldTouched, oldValid)}
        />
        <img
          src={seeOldPW ? openEyeImg : closeEyeImg}
          className="w-[15px] absolute top-4 right-[15px] cursor-pointer"
          alt=""
          onClick={() => setSeeOldPW(!seeOldPW)}
        />
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!oldTouched || oldValid ? "invisible" : ""}`}>
          at least 8 characters of numbers and letters
        </div>
      </div>
      <div className="relative max-[500px]:w-[244px]">
        <InputTemplate
          value={newPassword}
          onchangeHandler={newPasswordHandler}
          spanValue={"new password"}
          type={seeNewPW ? "text" : "password"}
          inputClassName={getInputClassName(newTouched, newValid)}
        />
        <img
          src={seeNewPW ? openEyeImg : closeEyeImg}
          className="w-[15px] absolute top-4 right-[15px] cursor-pointer"
          alt=""
          onClick={() => setSeeNewPW(!seeNewPW)}
        />
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!newTouched || newValid ? "invisible" : ""}`}>
          at least 8 characters of numbers and letters
        </div>
      </div>
      <div className="relative max-[500px]:w-[244px]">
        <InputTemplate
          value={checkPassword}
          onchangeHandler={checkPasswordHandler}
          spanValue={"confirm password"}
          type={seeCheckPW ? "text" : "password"}
          inputClassName={getInputClassName(checkTouched, checkValid && checkSame)}
        />
        <img
          src={seeCheckPW ? openEyeImg : closeEyeImg}
          className="w-[15px] absolute top-4 right-[15px] cursor-pointer"
          alt=""
          onClick={() => setSeeCheckPW(!seeCheckPW)}
        />
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!checkTouched || checkValid ? "invisible" : ""}`}>
          at least 8 characters of numbers and letters
        </div>
        <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!checkTouched || !checkValid || checkSame ? "invisible" : ""}`}>
          new and confirm password not the same
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
