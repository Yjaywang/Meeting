import React from "react";
import { connect } from "react-redux";
import PeopleImg from "../../../../assets/images/people.svg";

const { v4: uuidv4 } = require("uuid");

const ChatMessage = ({ content, author, sameAsPreAuthor, createByMe }) => {
  const containerAlignClass = createByMe
    ? "container-align-right"
    : "container-align-left";
  const messageAuthorContainerClass = createByMe
    ? "message-author-align-right"
    : "message-author-align-left";
  const authorText = createByMe ? "Me" : author;
  const messageStyleClass = createByMe
    ? "message-right-style"
    : "message-left-style";

  return (
    <div className={`message-container ${containerAlignClass}`}>
      {!sameAsPreAuthor && (
        <div
          className={`message-author-container ${messageAuthorContainerClass}`}
        >
          <img className="message-avatar" src={PeopleImg} alt="" />
          <div className="message-author">{authorText}</div>
        </div>
      )}
      <div className={`message-text-container ${containerAlignClass}`}>
        <div className={`message-text ${messageStyleClass}`}>{content}</div>
      </div>
    </div>
  );
};
const ChatMessages = ({ messages }) => {
  return (
    <div className="messages-container">
      {messages.map((message, index) => {
        const sameAsPreAuthor =
          index > 0 && message.username === messages[index - 1].username;

        return (
          <ChatMessage
            key={`${message.username}${message.content}${uuidv4()}`}
            content={message.content}
            author={message.username}
            sameAsPreAuthor={sameAsPreAuthor}
            createByMe={message.createByMe}
          />
        );
      })}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(ChatMessages);
