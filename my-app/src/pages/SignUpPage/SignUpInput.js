import React from "react";
import InputTemplate from "../../components/InputTemplate";

const SignUpInput = (props) => {
  const { username, setUsername, email, setEmail, password, setPassword } =
    props;
  const usernameHandler = (e) => {
    setUsername(e.target.value);
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div>
      <InputTemplate
        value={username}
        onchangeHandler={usernameHandler}
        spanValue={"Username"}
        type={"text"}
      />
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

export default SignUpInput;
