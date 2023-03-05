import React from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatTitle from "./ChatTitle";

const ChatRegion = () => {
  return (
    <>
      <ChatTitle />
      <ChatMessages />
      <ChatInput />
    </>
  );
};

export default ChatRegion;
