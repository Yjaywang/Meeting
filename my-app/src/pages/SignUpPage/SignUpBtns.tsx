import React from "react";

interface SignUpBtnsProps {
  handler: () => void;
  disabled: boolean;
}

const SignUpBtns: React.FC<SignUpBtnsProps> = ({ handler, disabled }) => {
  return (
    <div
      onClick={handler}
      className={`text-center w-[240px] h-[40px] mx-auto mb-2.5 flex items-center justify-center border border-[#e5e5e5] font-bold rounded-md transition-colors duration-300 ${
        disabled
          ? "bg-muted text-black cursor-not-allowed"
          : "bg-primary text-white cursor-pointer hover:bg-primary-hover"
      }`}
    >
      Sign Up
    </div>
  );
};

export default SignUpBtns;
