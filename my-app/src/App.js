import { React, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import JoinPage from "./pages/JoinPage/JoinPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import PreviewPage from "./pages/PreviewPage/PreviewPage";
import { connectSocketIOServer } from "./utils/webSocketApi";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import StartSchedulePage from "./pages/StartSchedulePage/StartSchedulePage";
import ProfileRegion from "./pages/MemberPage/ProfileRegion/ProfileRegion";
import RecordingRegion from "./pages/MemberPage/RecordingRegion/RecordingRegion";
import ScheduleRegion from "./pages/MemberPage/ScheduleRegion/ScheduleRegion";

function App() {
  useEffect(() => {
    connectSocketIOServer();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/profile">
          <ProfileRegion />
        </Route>
        <Route path="/recording">
          <RecordingRegion />
        </Route>
        <Route path="/schedulePlan">
          <ScheduleRegion />
        </Route>
        <Route path="/startSchedule">
          <StartSchedulePage />
        </Route>
        <Route path="/signIn">
          <SignInPage />
        </Route>
        <Route path="/signUp">
          <SignUpPage />
        </Route>
        <Route path="/join">
          <JoinPage />
        </Route>
        <Route path="/room">
          <RoomPage />
        </Route>
        <Route path="/preview">
          <PreviewPage />
        </Route>
        <Route path="/">
          <WelcomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
