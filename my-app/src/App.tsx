import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage/JoinPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import PreviewPage from "./pages/PreviewPage/PreviewPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfileRegion from "./pages/MemberPage/ProfileRegion/ProfileRegion";
import RecordingRegion from "./pages/MemberPage/RecordingRegion/RecordingRegion";
import MemberLayout from "./pages/MemberPage/MemberLayout";
import MeetingLayout from "./pages/MeetingLayout";
import LandingPage from "./pages/LandingPage/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SocketProvider } from "./contexts/SocketContext";
import { useAppDispatch } from "./store/hooks";
import { initializeUser } from "./store/thunks/initializeUser";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MemberLayout />}>
              <Route path="/profile" element={<ProfileRegion />} />
              <Route path="/recording" element={<RecordingRegion />} />
            </Route>
            <Route path="/join" element={<JoinPage />} />
            <Route element={<MeetingLayout />}>
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/room" element={<RoomPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
