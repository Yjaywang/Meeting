import React from "react";

interface SignUpBtnsProps {
  handler: () => void;
}

const SignUpBtns: React.FC<SignUpBtnsProps> = ({ handler }) => {
  return (<div onClick={handler} className="sign-up-btn btn-not-allowed">Sign Up</div>);
};

export default SignUpBtns;
