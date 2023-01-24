import React from "react";
import ChatEmoji from "./ChatEmoji";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatTitle from "./ChatTitle";

const ChatRegion = () => {
  return (
    <div>
      <ChatTitle />
      <ChatMessages />
      <ChatInput />
      <ChatEmoji />
    </div>
  );
};

export default ChatRegion;
