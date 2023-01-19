import { React, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import JoinPage from "./pages/JoinPage/JoinPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import MemberPage from "./pages/MemberPage/MemberPage";
import PreviewPage from "./pages/PreviewPage/PreviewPage";
import { connectSocketIOServer } from "./utils/webSocketApi";
function App() {
  useEffect(() => {
    connectSocketIOServer();
  });

  return (
    <Router>
      <Switch>
        <Route path="/member">
          <MemberPage />
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
