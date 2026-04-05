import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signIn } from "../../utils/fetchUserApi";
import SignInBtns from "./SignInBtns";
import SignInInput from "./SignInInput";
import { setAvatar, setIsSignIn, setUsername } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import * as validFormat from "../../utils/validFormat";
import loadingImg from "../../assets/images/sing-in-loading.png";
import googleImg from "../../assets/images/google_login.png";
import { useAppDispatch } from "../../store/hooks";

const SignInContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInErr, setSignInErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInHandler = async () => {
    if (!validFormat.validateEmail(email) || !validFormat.validatePassword(password)) {
      return;
    }
    setLoading(true);
    try {
      const response = await signIn({ email, password });
      if (response.ok) {
        dispatch(setIsSignIn(true));
        dispatch(setUsername(response.data.username));
        dispatch(setAvatar(response.data.avatar));
        navigate("/");
      }
      if (response.error) {
        dispatch(setIsSignIn(false));
        setSignInErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
  };

  const switchToSignUp = () => { navigate("/signUp"); };

  function keyDownHandler(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (validFormat.validateEmail(email) && validFormat.validatePassword(password)) {
        signInHandler();
      }
    }
  }

  return (
    <div className="sign-in-up-container">
      <div className="sign-in-up-title">Sign In</div>
      <SignInInput email={email} setEmail={setEmail} password={password} setPassword={setPassword} keyDownHandler={keyDownHandler} />
      <div className="sign-in-error-container"><ErrorMessages errMsg={signInErr} /></div>
      <div className="btn-and-loading-container">
        <SignInBtns handler={signInHandler} />
        {loading && <img src={loadingImg} className="sign-in-up-loading" alt="" />}
      </div>
      <div className="google-auth-container">
        <div className="google-auth-text">or sign in with google account</div>
        <div className="google-img-container">
          <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`}>
            <img src={googleImg} className="google-img" alt="" />
          </a>
        </div>
      </div>
      <div className="switch-sign-in-up" onClick={switchToSignUp}>First time visit? Sign up now!</div>
    </div>
  );
};

export default SignInContent;
