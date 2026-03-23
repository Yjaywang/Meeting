import React from "react";

interface PreviewBtnsProps {
  clickHandler: () => void;
  loading: boolean;
}

const PreviewBtns: React.FC<PreviewBtnsProps> = ({ clickHandler, loading }) => {
  return (<div className={loading ? "preview-btn btn-not-allowed" : "preview-btn"} onClick={clickHandler}>Enter the room</div>);
};

export default PreviewBtns;
