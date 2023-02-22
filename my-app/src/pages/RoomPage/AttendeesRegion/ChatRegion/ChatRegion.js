import React from "react";
import ChatEmoji from "./ChatEmoji";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatTitle from "./ChatTitle";

const ChatRegion = () => {
  return (
    <>
      <ChatTitle />
      <ChatMessages />
      <ChatInput />
      <ChatEmoji />
    </>
  );
};

export default ChatRegion;
