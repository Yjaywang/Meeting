import React from "react";
import { Outlet } from "react-router-dom";
import { WebRTCProvider } from "../contexts/WebRTCContext";

const MeetingLayout: React.FC = () => {
  return (
    <WebRTCProvider>
      <Outlet />
    </WebRTCProvider>
  );
};

export default MeetingLayout;
