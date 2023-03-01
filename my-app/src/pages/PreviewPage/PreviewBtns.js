import React from "react";

const PreviewBtns = ({ clickHandler, loading }) => {
  return (
    <div
      className={loading ? "preview-btn btn-not-allowed" : "preview-btn"}
      onClick={clickHandler}
    >
      Enter the room
    </div>
  );
};

export default PreviewBtns;
