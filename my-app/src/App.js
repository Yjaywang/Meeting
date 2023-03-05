import { React, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage/JoinPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import PreviewPage from "./pages/PreviewPage/PreviewPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProfileRegion from "./pages/MemberPage/ProfileRegion/ProfileRegion";
import RecordingRegion from "./pages/MemberPage/RecordingRegion/RecordingRegion";
import LandingPage from "./pages/LandingPage/LandingPage";
import * as initializeInfo from "./utils/initializeInfo";

function App() {
  useEffect(() => {
    initializeInfo.initialize();
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
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
