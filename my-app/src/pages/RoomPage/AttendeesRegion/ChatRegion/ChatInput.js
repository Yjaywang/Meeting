import React, { useState } from "react";
import sendMessageImg from "../../../../assets/images/send_message.svg";
import { sendMsgDataThroughDataChannel } from "../../../../utils/webRTCApi";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const changeHandler = (event) => {
    setMessage(event.target.value);
  };

  const keyDownHandler = (event) => {
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
    <div className="message-input-container">
      <input
        className="message-input"
        value={message}
        onChange={changeHandler}
        placeholder="message to others ..."
        type="text"
        onKeyDown={keyDownHandler}
      />
      <img
        className="send-message-img"
        src={sendMessageImg}
        onClick={sendMessageHandler}
        alt=""
      />
    </div>
  );
};

export default ChatInput;
