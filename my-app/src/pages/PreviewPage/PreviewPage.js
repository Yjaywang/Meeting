import React, { useState, useEffect } from "react";
import "./PreviewPage.css";
import { connect } from "react-redux";
import PreviewContent from "./PreviewContent";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { setIsCamOff, setIsMuted } from "../../store/actions";
import { useHistory } from "react-router-dom";

const PreviewPage = ({
  isMuted,
  setIsMutedAction,
  isCamOff,
  setIsCamOffAction,
  username,
  isSignIn,
}) => {
  const [stream, setStream] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (!isSignIn) {
      history.push("/");
    }
  }, [isSignIn]);
  return (
    <>
      <Nav />
      <div className="preview-page-container">
        <PreviewContent
          stream={stream}
          setStream={setStream}
          isMuted={isMuted}
          setIsMutedAction={setIsMutedAction}
          isCamOff={isCamOff}
          setIsCamOffAction={setIsCamOffAction}
          username={username}
        />
      </div>
      <Footer />
    </>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsMutedAction: (isMuted) => dispatch(setIsMuted(isMuted)),
    setIsCamOffAction: (isCamOff) => dispatch(setIsCamOff(isCamOff)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(PreviewPage);
