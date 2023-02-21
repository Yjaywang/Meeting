import React from "react";

const PreviewBtns = ({ clickHandler }) => {
  return (
    <div className="preview-btn" onClick={clickHandler}>
      Enter the room
    </div>
  );
};

export default PreviewBtns;
