import React, { useState } from "react";
import ChatImg from "../../../../assets/images/chat.svg";
const ShowChatBtn = () => {
  const [isChat, setIsChat] = useState(false);
  const handler = () => {
    setIsChat(!isChat);
  };
  return (
    <div>
      <img className="chat-btn-img" onClick={handler} src={ChatImg} alt="" />
    </div>
  );
};

export default ShowChatBtn;
