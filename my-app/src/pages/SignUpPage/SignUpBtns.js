import React from "react";

const SignUpBtns = ({ handler }) => {
  return (
    <div onClick={handler} className="sign-up-btn">
      Sign Up
    </div>
  );
};

export default SignUpBtns;
