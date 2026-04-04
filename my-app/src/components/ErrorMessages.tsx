import React from "react";

interface ErrorMessagesProps {
  errMsg: string;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errMsg }) => {
  return (
    <div>
      {errMsg && <div className="bg-[rgba(248,103,103,0.2)] rounded-md mb-2.5 p-2.5 text-sm">{errMsg}</div>}
    </div>
  );
};

export default ErrorMessages;
