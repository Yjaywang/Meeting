import React from "react";

const SignInBtns = ({ handler }) => {
  return (
    <div onClick={handler} className="sign-in-up-btn">
      Sign In
    </div>
  );
};

export default SignInBtns;
