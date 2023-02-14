import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signUp } from "../../utils/fetchUserApi";
import SignUpBtns from "./SignUpBtns";
import SignUpInput from "./SignUpInput";
import { useHistory } from "react-router-dom";

const SignUpContent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpErr, setSignUpErr] = useState("");
  const history = useHistory();

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

  const switchToSignIn = () => {
    history.push("/signin");
  };
  return (
    <div className="sign-in-up-container">
      <div className="sign-in-up-title">Sign Up</div>
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
      <div className="switch-sign-in-up" onClick={switchToSignIn}>
        Already have account? Sign in now!
      </div>
    </div>
  );
};

export default SignUpContent;
