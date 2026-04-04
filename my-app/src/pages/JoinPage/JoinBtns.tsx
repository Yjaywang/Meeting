import React from "react";
import { useNavigate } from "react-router-dom";

interface BtnProps {
  text: string;
  handler: () => void;
  variant: "primary" | "cancel";
  disabled?: boolean;
}

const Btn: React.FC<BtnProps> = ({ text, handler, variant, disabled = false }) => {
  const baseClasses = "flex justify-center items-center w-[80px] h-[30px] font-bold rounded-md transition-colors duration-300 cursor-pointer";
  const variantClasses = variant === "cancel"
    ? "bg-surface-secondary border border-[#e5e5e5] hover:bg-gray-300"
    : disabled
      ? "bg-muted text-black cursor-not-allowed"
      : "bg-primary text-white hover:bg-primary-hover";
  return (<div onClick={handler} className={`${baseClasses} ${variantClasses}`}>{text}</div>);
};

interface JoinBtnsProps {
  newIsHost?: string | null;
  handler: () => void;
  disabled: boolean;
}

const JoinBtns: React.FC<JoinBtnsProps> = ({ newIsHost, handler, disabled }) => {
  const btnText = newIsHost ? "Host" : "Join";
  const navigate = useNavigate();
  const cancelHandler = () => { navigate("/"); };
  return (
    <div className="flex justify-center items-center gap-[30px] w-full">
      <Btn text={btnText} handler={handler} variant="primary" disabled={disabled} />
      <Btn text="Cancel" handler={cancelHandler} variant="cancel" />
    </div>
  );
};

export default JoinBtns;
