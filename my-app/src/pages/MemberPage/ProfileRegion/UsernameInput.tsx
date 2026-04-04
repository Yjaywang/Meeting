import React, { useState } from "react";
import InputTemplate from "../../../components/InputTemplate";
import * as validFormat from "../../../utils/validFormat";

interface UsernameInputProps {
  newUsername: string;
  setNewUsername: React.Dispatch<React.SetStateAction<string>>;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ newUsername, setNewUsername }) => {
  const [touched, setTouched] = useState(false);
  const isValid = validFormat.validateUsername(newUsername);

  function newUsernameHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setNewUsername(e.target.value);
    setTouched(true);
  }

  function getInputClassName() {
    if (!touched) return "";
    return isValid ? "!border-success" : "!border-danger";
  }

  return (
    <div className="max-[500px]:w-[244px]">
      <InputTemplate
        value={newUsername}
        onchangeHandler={newUsernameHandler}
        spanValue={"new username"}
        type={"text"}
        inputClassName={getInputClassName()}
      />
      <div className={`text-danger mb-2.5 text-xs w-[240px] text-left ${!touched || isValid ? "invisible" : ""}`}>
        1~8 characters long
      </div>
    </div>
  );
};

export default UsernameInput;
