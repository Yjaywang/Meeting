import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signUp } from "../../utils/fetchUserApi";
import SignUpBtns from "./SignUpBtns";
import SignUpInput from "./SignUpInput";
import { useNavigate } from "react-router-dom";
import * as validFormat from "../../utils/validFormat";
import loadingImg from "../../assets/images/sing-in-loading.png";
import Modal from "../../components/Modal/Modal";

const SignUpContent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpErr, setSignUpErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const isFormValid = validFormat.validateEmail(email) && validFormat.validatePassword(password) && validFormat.validateUsername(username);

  async function signUpHandler() {
    if (!isFormValid) { return; }
    setLoading(true);
    try {
      const response = await signUp({ username, email, password });
      if (response.ok) { setOpenModal(true); }
      if (response.error) { setSignUpErr(response.message); }
    } catch (error) { console.log("error: ", error); }
    setLoading(false);
  }

  const switchToSignIn = () => { setOpenModal(false); navigate("/signIn"); };

  function keyDownHandler(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isFormValid) { signUpHandler(); }
    }
  }

  return (
    <>
      <div className="w-[300px] bg-surface border border-surface-secondary drop-shadow-[0_0_0.2rem_gray] flex flex-col items-center justify-evenly rounded-md">
        <div className="text-center text-[26px] font-bold p-2.5">Sign Up</div>
        <SignUpInput username={username} setUsername={setUsername} email={email} setEmail={setEmail} password={password} setPassword={setPassword} keyDownHandler={keyDownHandler} />
        <div className="w-[242px]"><ErrorMessages errMsg={signUpErr} /></div>
        <div className="relative">
          <SignUpBtns handler={signUpHandler} disabled={!isFormValid} />
          {loading && <img src={loadingImg} className="w-5 absolute top-3 left-3" alt="" />}
        </div>
        <div className="mx-auto text-center cursor-pointer text-primary mb-2.5 hover:underline" onClick={switchToSignIn}>Already have account? Sign in now!</div>
      </div>
      {openModal && <Modal modalTitle="Message" modalBody="Sign up success, will redirect to sign in page" btnHandler={switchToSignIn} btnText="OK" />}
    </>
  );
};

export default SignUpContent;
