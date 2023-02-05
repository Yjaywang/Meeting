import React from "react";
import InputTemplate from "../../components/InputTemplate";

const SignInInput = (props) => {
  const { email, setEmail, password, setPassword } = props;

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div>
      <InputTemplate
        value={email}
        onchangeHandler={emailHandler}
        spanValue={"Email"}
        type={"text"}
      />
      <InputTemplate
        value={password}
        onchangeHandler={passwordHandler}
        spanValue={"password"}
        type={"password"}
      />
    </div>
  );
};

export default SignInInput;
