import React from "react";
import LoadingImg from "../../assets/images/loading.png";

const Loading: React.FC = () => {
  return (
    <div className="absolute flex justify-center items-center text-center h-full w-full">
      <img src={LoadingImg} alt="" />
    </div>
  );
};

export default Loading;
