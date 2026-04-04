import React from "react";
import PeopleImg from "../../../../assets/images/people.svg";
import { ChatMessage } from "../../../../types/redux";
import { useAppSelector } from "../../../../store/hooks";
import { selectMessages } from "../../../../store/selectors";

import { v4 as uuidv4 } from "uuid";

interface ChatMessageProps {
  content: string;
  author: string;
  sameAsPreAuthor: boolean;
  createByMe?: boolean;
  avatar: string;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  content,
  author,
  sameAsPreAuthor,
  createByMe,
  avatar,
}) => {
  const containerAlignClass = createByMe ? "justify-end" : "";
  const messageAuthorContainerClass = createByMe ? "justify-end" : "";
  const authorText = createByMe ? "Me" : author;
  const messageStyleClass = createByMe
    ? "bg-primary text-surface rounded-lg p-[5px] mb-[5px]"
    : "bg-muted text-surface rounded-lg p-[5px] mb-[5px]";

  return (
    <div className={`flex flex-col ${containerAlignClass}`}>
      {!sameAsPreAuthor && (
        <div
          className={`flex gap-2.5 mb-[2px] ${messageAuthorContainerClass}`}
        >
          <img
            className="h-[25px] object-cover rounded-full"
            src={avatar ? avatar : PeopleImg}
            alt=""
          />
          <div className="text-center font-bold">{authorText}</div>
        </div>
      )}
      <div className={`flex ${containerAlignClass}`}>
        <div className={`w-auto break-all ${messageStyleClass}`}>{content}</div>
      </div>
    </div>
  );
};

const ChatMessages: React.FC = () => {
  const messages = useAppSelector(selectMessages);
  return (
    <div className="px-2.5 h-[calc(100%-75px)] overflow-auto custom-scrollbar">
      {messages.map((message, index) => {
        const sameAsPreAuthor =
          index > 0 &&
          message.selfSocketId === messages[index - 1].selfSocketId;

        return (
          <ChatMessageComponent
            key={`${message.username}${message.content}${uuidv4()}`}
            content={message.content}
            author={message.username}
            sameAsPreAuthor={sameAsPreAuthor}
            createByMe={message.createByMe}
            avatar={message.avatar}
          />
        );
      })}
    </div>
  );
};

export default ChatMessages;
