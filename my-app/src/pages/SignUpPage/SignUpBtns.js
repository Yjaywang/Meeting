import React from "react";

const SignUpBtns = ({ handler }) => {
  return (
    <div onClick={handler} className="sign-in-up-btn">
      Sign Up
    </div>
  );
};

export default SignUpBtns;
