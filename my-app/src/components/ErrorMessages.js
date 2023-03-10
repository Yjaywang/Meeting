import React from "react";

const ErrorMessages = ({ errMsg }) => {
  return (
    <div className="error-message-container">
      {errMsg && <div className="error-message">{errMsg}</div>}
    </div>
  );
};

export default ErrorMessages;
