import React from "react";
import ChatImg from "../../../../assets/images/chat.svg";

interface ShowChatBtnProps {
  isChat: boolean;
  setIsChat: (isChat: boolean) => void;
}

const ShowChatBtn: React.FC<ShowChatBtnProps> = ({ isChat, setIsChat }) => {
  const handler = () => {
    setIsChat(!isChat);
  };

  return (
    <div
      className={`text-center cursor-pointer rounded-lg transition-colors duration-300 h-[70px] w-[110px] flex items-center hover:bg-surface-dark max-[870px]:w-[50px] max-[870px]:justify-center max-[450px]:w-[35px] ${isChat ? "bg-gray-600" : ""}`}
      onClick={handler}
    >
      <div>
        <img className="h-[25px] object-cover" src={ChatImg} alt="" />
        <div className="text-muted text-sm w-[110px] max-[870px]:text-xs max-[870px]:w-[50px] max-[450px]:text-[8px] max-[450px]:w-[35px]">
          {isChat ? "Hide chat" : "Show chat"}
        </div>
      </div>
    </div>
  );
};

export default ShowChatBtn;
