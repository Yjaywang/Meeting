import React from "react";

const LeaveBtn: React.FC = () => {
  //need to clear state, history will remember state, so use location.herf
  const redirectHandler = () => {
    const rootUrl = window.location.origin;
    window.location.href = rootUrl;
  };

  return (
    <div>
      <div
        className="text-surface font-bold text-center leading-[30px] h-[30px] w-[60px] bg-danger rounded-md border-0 transition-colors duration-300 cursor-pointer hover:bg-danger-hover max-[870px]:text-xs max-[870px]:w-10 max-[450px]:text-[8px] max-[450px]:w-[30px]"
        onClick={redirectHandler}
      >
        Leave
      </div>
    </div>
  );
};

export default LeaveBtn;
