import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage/JoinPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import PreviewPage from "./pages/PreviewPage/PreviewPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfileRegion from "./pages/MemberPage/ProfileRegion/ProfileRegion";
import RecordingRegion from "./pages/MemberPage/RecordingRegion/RecordingRegion";
import LandingPage from "./pages/LandingPage/LandingPage";
import * as initializeInfo from "./utils/initializeInfo";

const App: React.FC = () => {
  useEffect(() => {
    initializeInfo.initialize();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<ProfileRegion />} />
        <Route path="/recording" element={<RecordingRegion />} />
        <Route path="/signIn" element={<SignInPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
