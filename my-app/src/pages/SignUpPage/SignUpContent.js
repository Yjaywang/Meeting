import React from "react";
import InputTemplate from "../../components/InputTemplate";
import SignUpBtns from "./SignUpBtns";
import SignUpErrors from "./SignUpErrors";

const SignUpContent = () => {
  return (
    <div>
      <InputTemplate />
      <SignUpBtns />
      <SignUpErrors />
    </div>
  );
};

export default SignUpContent;
