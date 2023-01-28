import React, { useState } from "react";
import ChatImg from "../../../../assets/images/chat.svg";
const ShowChatBtn = () => {
  const [isChat, setIsChat] = useState(false);
  const handler = () => {
    setIsChat(!isChat);

    const chatBtnImgEl =
      document.querySelector(".chat-btn-img").parentNode.parentNode;
    chatBtnImgEl.classList.toggle("function-btn-selected");

    const chatRegionContainerEl = document.querySelector(
      ".chat-region-container"
    );
    chatRegionContainerEl.classList.toggle("hide");

    //chat or attendee not hide, remove container hide
    const attendeeChatContainerEl = document.querySelector(
      ".attendee-chat-region-container"
    );
    const attendeeRegionContainerEl = document.querySelector(
      ".attendee-region-container"
    );
    if (
      !attendeeRegionContainerEl.classList.contains("hide") ||
      !chatRegionContainerEl.classList.contains("hide")
    ) {
      attendeeChatContainerEl.classList.remove("width-zero");
    } else {
      attendeeChatContainerEl.classList.add("width-zero");
    }
  };
  return (
    <div className="function-btn-container" onClick={handler}>
      <div>
        <img className="chat-btn-img function-btn-img" src={ChatImg} alt="" />
        <div className="function-btn-name">
          {isChat ? "Hide chat" : "Show chat"}
        </div>
      </div>
    </div>
  );
};

export default ShowChatBtn;
