import React, { useState } from "react";
import copyImg from "../../assets/images/copy_icon.svg";
import copyDoneImg from "../../assets/images/ok.svg";

interface DisplayRoomIdProps {
  roomId: string;
}

const DisplayRoomId: React.FC<DisplayRoomIdProps> = ({ roomId }) => {
  const [isCopy, setIsCopy] = useState<boolean>(false);

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
    <div className="text-muted text-sm h-[50px] flex flex-col items-center justify-center gap-[5px] max-[870px]:text-xs max-[450px]:text-[8px]">
      <div>{roomId}</div>
      <div className="flex gap-[5px]">
        <img
          src={isCopy ? copyDoneImg : copyImg}
          className="object-cover w-[15px] cursor-pointer"
          alt=""
          onClick={copyHandler}
        />
        <div>Room ID</div>
      </div>
    </div>
  );
};

export default DisplayRoomId;
