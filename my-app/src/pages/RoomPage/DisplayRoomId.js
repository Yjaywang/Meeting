import React, { useState } from "react";
import "./RoomPage.css";
import copyImg from "../../assets/images/copy_icon.svg";
import copyDoneImg from "../../assets/images/ok.svg";

const DisplayRoomId = ({ roomId }) => {
  const [isCopy, setIsCopy] = useState(false);

  function copyHandler() {
    if (!isCopy) {
      const textarea = document.createElement("textarea");
      textarea.value = `${window.location.origin}/join?roomId=${roomId}`;

      // Append the textarea element to the body
      document.body.appendChild(textarea);

      // Select the text content of the textarea element
      textarea.select();

      // Copy the text content to the clipboard
      document.execCommand("copy");

      // Remove the textarea element from the body
      document.body.removeChild(textarea);
    }
    setIsCopy(!isCopy);
    setTimeout(() => {
      setIsCopy(false);
    }, 5000);
  }

  return (
    <div className="display-room-id-container">
      <div className="display-room-id-text">{roomId}</div>
      <div className="copy-roomId-container">
        <img
          src={isCopy ? copyDoneImg : copyImg}
          className="copy-img"
          alt=""
          onClick={copyHandler}
        />
        <div>Room ID</div>
      </div>
    </div>
  );
};

export default DisplayRoomId;
