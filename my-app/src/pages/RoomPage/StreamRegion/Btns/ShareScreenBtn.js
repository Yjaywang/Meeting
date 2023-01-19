import React, { useState } from "react";
import ShareScreenImg from "../../../../assets/images/share_screen.svg";

const ShareScreenBtn = () => {
  const [isShared, setIsShared] = useState(false);
  const handler = () => {
    setIsShared(!isShared);
  };
  return (
    <div>
      <img
        className="share-screen-btn-img"
        onClick={handler}
        src={ShareScreenImg}
        alt=""
      />
    </div>
  );
};

export default ShareScreenBtn;
