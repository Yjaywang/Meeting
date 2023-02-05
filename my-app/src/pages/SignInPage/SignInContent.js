import React from "react";
import InputTemplate from "../../components/InputTemplate";
import SignInBtns from "./SignInBtns";
import SignInErrors from "./SignInErrors";

const SignInContent = () => {
  return (
    <div>
      <InputTemplate />
      <SignInBtns />
      <SignInErrors />
    </div>
  );
};

export default SignInContent;
