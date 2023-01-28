import React from "react";
import "./RoomPage.css";
const DisplayRoomId = ({ roomId }) => {
  return (
    <div className="display-room-id-container">
      <div className="display-room-id-text">{roomId}</div>
      <div>Room ID</div>
    </div>
  );
};

export default DisplayRoomId;
