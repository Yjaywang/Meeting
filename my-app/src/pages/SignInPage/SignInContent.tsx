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

  const isFormValid = validFormat.validateEmail(email) && validFormat.validatePassword(password);

  const signInHandler = async () => {
    if (!isFormValid) { return; }
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
      if (isFormValid) { signInHandler(); }
    }
  }

  return (
    <div className="w-[300px] bg-surface border border-surface-secondary drop-shadow-[0_0_0.2rem_gray] flex flex-col items-center justify-evenly rounded-md">
      <div className="text-center text-[26px] font-bold p-2.5">Sign In</div>
      <SignInInput email={email} setEmail={setEmail} password={password} setPassword={setPassword} keyDownHandler={keyDownHandler} />
      <div className="w-[242px]"><ErrorMessages errMsg={signInErr} /></div>
      <div className="relative">
        <SignInBtns handler={signInHandler} disabled={!isFormValid} />
        {loading && <img src={loadingImg} className="w-5 absolute top-3 left-3" alt="" />}
      </div>
      <div className="flex flex-col items-center gap-2.5 mb-2.5">
        <div className="text-muted text-sm">or sign in with google account</div>
        <div className="w-[242px] h-[40px]">
          <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`}>
            <img src={googleImg} className="object-cover w-full h-full rounded-md drop-shadow-[0_0_0.1rem_#A0A0A0] cursor-pointer" alt="" />
          </a>
        </div>
      </div>
      <div className="mx-auto text-center cursor-pointer text-primary mb-2.5 hover:underline" onClick={switchToSignUp}>First time visit? Sign up now!</div>
    </div>
  );
};

export default SignInContent;
