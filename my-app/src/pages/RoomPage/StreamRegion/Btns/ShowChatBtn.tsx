import React from "react";
import ChatImg from "../../../../assets/images/chat.svg";

interface ShowChatBtnProps {
  isChat: boolean;
  setIsChat: (isChat: boolean) => void;
}

const ShowChatBtn: React.FC<ShowChatBtnProps> = ({ isChat, setIsChat }) => {
  const handler = () => {
    setIsChat(!isChat);

    const chatBtnImgEl =
      (document.querySelector(".chat-btn-img") as HTMLElement).parentNode!.parentNode as HTMLElement;
    chatBtnImgEl.classList.toggle("function-btn-selected");

    const chatRegionContainerEl = document.querySelector(
      ".chat-region-container"
    ) as HTMLElement;
    chatRegionContainerEl.classList.toggle("hide");

    //chat or attendee not hide, remove container hide
    const attendeeChatContainerEl = document.querySelector(
      ".attendee-chat-region-container"
    ) as HTMLElement;
    const attendeeRegionContainerEl = document.querySelector(
      ".attendee-region-container"
    ) as HTMLElement;
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
