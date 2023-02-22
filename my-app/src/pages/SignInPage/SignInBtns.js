import React from "react";

const SignInBtns = ({ handler }) => {
  return (
    <div onClick={handler} className="sign-in-btn btn-not-allowed">
      Sign In
    </div>
  );
};

export default SignInBtns;
