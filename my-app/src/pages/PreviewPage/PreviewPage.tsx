import React, { useState, useEffect } from "react";
import "./PreviewPage.css";
import { connect } from "react-redux";
import PreviewContent from "./PreviewContent";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { setIsCamOff, setIsMuted } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import { refresh } from "../../utils/fetchUserApi";
import { RootState, AppAction } from "../../types/redux";
import { Dispatch } from "redux";

interface PreviewPageProps {
  isMuted?: boolean;
  setIsMutedAction?: (isMuted: boolean) => void;
  isCamOff?: boolean;
  setIsCamOffAction?: (isCamOff: boolean) => void;
  username?: string;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ isMuted = true, setIsMutedAction, isCamOff = false, setIsCamOffAction, username = "" }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.error) { navigate("/signIn"); }
      } catch (error) { console.log("error: ", error); }
    }
    checkSignIn();
  }, []);

  return (
    <>
      <Nav />
      <div className="preview-page-container">
        <PreviewContent stream={stream} setStream={setStream} isMuted={isMuted} setIsMutedAction={setIsMutedAction!} isCamOff={isCamOff} setIsCamOffAction={setIsCamOffAction!} username={username} />
      </div>
      <Footer />
    </>
  );
};

const mapStoreStateToProps = (state: RootState) => { return { ...state }; };
const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
  return {
    setIsMutedAction: (isMuted: boolean) => dispatch(setIsMuted(isMuted)),
    setIsCamOffAction: (isCamOff: boolean) => dispatch(setIsCamOff(isCamOff)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(PreviewPage);
