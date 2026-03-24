import React from "react";

interface SignInBtnsProps {
  handler: () => void;
}

const SignInBtns: React.FC<SignInBtnsProps> = ({ handler }) => {
  return (
    <div onClick={handler} className="sign-in-btn btn-not-allowed">Sign In</div>
  );
};

export default SignInBtns;
