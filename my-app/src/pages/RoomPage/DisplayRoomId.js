import React from "react";
import "./RoomPage.css";
const DisplayRoomId = ({ roomId }) => {
  return (
    <div className="display-room-id-container">
      <div className="display-room-id-text">Room ID: {roomId}</div>
    </div>
  );
};

export default DisplayRoomId;
