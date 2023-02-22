import React from "react";

const LeaveBtn = () => {
  //need to clear state, history will remember state, so use location.herf
  const redirectHandler = () => {
    const rootUrl = window.location.origin;
    window.location.href = rootUrl;
  };

  return (
    <div>
      <div className="leave-btn" onClick={redirectHandler}>
        Leave
      </div>
    </div>
  );
};

export default LeaveBtn;
