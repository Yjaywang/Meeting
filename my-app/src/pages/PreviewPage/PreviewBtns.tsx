import React from "react";

interface PreviewBtnsProps {
  clickHandler: () => void;
  loading: boolean;
}

const PreviewBtns: React.FC<PreviewBtnsProps> = ({ clickHandler, loading }) => {
  return (
    <div
      className={`text-center w-[480px] h-[40px] mx-auto mb-2.5 flex items-center justify-center border border-[#e5e5e5] font-bold rounded-md transition-colors duration-300 max-[500px]:w-[320px] ${
        loading
          ? "bg-muted text-black cursor-not-allowed"
          : "bg-primary text-white cursor-pointer hover:bg-primary-hover"
      }`}
      onClick={clickHandler}
    >
      Enter the room
    </div>
  );
};

export default PreviewBtns;
