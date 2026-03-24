import React from "react";

interface ErrorMessagesProps {
  errMsg: string;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errMsg }) => {
  return (
    <div className="error-message-container">
      {errMsg && <div className="error-message">{errMsg}</div>}
    </div>
  );
};

export default ErrorMessages;
