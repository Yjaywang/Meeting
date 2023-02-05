import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signIn } from "../../utils/fetchUserApi";
import SignInBtns from "./SignInBtns";
import SignInInput from "./SignInInput";
import { connect } from "react-redux";
import { setSignIn } from "../../store/actions";
import { useHistory } from "react-router-dom";

const SignInContent = (props) => {
  const { setSignInAction } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInErr, setSignInErr] = useState("");
  const history = useHistory();

  const signInHandler = async () => {
    const response = await signIn({
      email: email,
      password: password,
    });
    if (response.ok) {
      setSignInAction(true);
      history.push("/");
    }
    if (response.error) {
      setSignInAction(false);
      setSignInErr(response.message);
    }
  };
  return (
    <div>
      <SignInInput
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <SignInBtns handler={signInHandler} />
      <ErrorMessages errMsg={signInErr} />
    </div>
  );
};

//props subscript state, auto update if state updated
const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};
// props can direct use action
const mapDispatchToProps = (dispatch) => {
  return {
    setSignInAction: (isSignIn) => dispatch(setSignIn(isSignIn)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(SignInContent);
