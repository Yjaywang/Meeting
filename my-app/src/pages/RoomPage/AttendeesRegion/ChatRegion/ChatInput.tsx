import React, { useState } from "react";
import sendMessageImg from "../../../../assets/images/send_message.svg";
import { sendMsgDataThroughDataChannel } from "../../../../utils/webSocketApi";

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      //send message
      sendMessageHandler();
    }
  };

  const sendMessageHandler = () => {
    if (message.length > 0) {
      //send message
      sendMsgDataThroughDataChannel(message);
      //reset
      setMessage("");
    }
  };

  return (
    <div className="px-2.5 flex items-center">
      <input
        className="p-2.5 w-[220px] mr-2.5 rounded-lg focus:outline-none focus:border-primary"
        value={message}
        onChange={changeHandler}
        placeholder="message to others ..."
        type="text"
        onKeyDown={keyDownHandler}
      />
      <img
        className="h-5 object-cover cursor-pointer"
        src={sendMessageImg}
        onClick={sendMessageHandler}
        alt=""
      />
    </div>
  );
};

export default ChatInput;
