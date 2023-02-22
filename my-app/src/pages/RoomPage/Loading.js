import React from "react";
import LoadingImg from "../../assets/images/loading.png";

const Loading = () => {
  return (
    <div className="loading-img-container">
      <img className="loading-img" src={LoadingImg} alt="" />
    </div>
  );
};

export default Loading;
