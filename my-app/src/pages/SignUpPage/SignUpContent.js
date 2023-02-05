import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signUp } from "../../utils/fetchUserApi";
import SignUpBtns from "./SignUpBtns";
import SignUpInput from "./SignUpInput";

const SignUpContent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpErr, setSignUpErr] = useState("");

  async function signUpHandler() {
    const response = await signUp({
      username: username,
      email: email,
      password: password,
    });
    if (response.ok) {
      window.location.href = "/";
    }
    if (response.error) {
      setSignUpErr(response.message);
    }
  }

  return (
    <div>
      <SignUpInput
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <SignUpBtns handler={signUpHandler} />
      <ErrorMessages errMsg={signUpErr} />
    </div>
  );
};

export default SignUpContent;
