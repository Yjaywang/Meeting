import React, { useState, useEffect, useCallback } from "react";
import PreviewContent from "./PreviewContent";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { setIsCamOff, setIsMuted } from "../../store/slices/mediaSlice";
import { useNavigate } from "react-router-dom";
import { refresh } from "../../utils/fetchUserApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectIsMuted, selectIsCamOff, selectUsername } from "../../store/selectors";

const PreviewPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector(selectIsMuted);
  const isCamOff = useAppSelector(selectIsCamOff);
  const username = useAppSelector(selectUsername);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();

  const setIsMutedAction = useCallback((v: boolean) => {
    dispatch(setIsMuted(v));
  }, [dispatch]);

  const setIsCamOffAction = useCallback((v: boolean) => {
    dispatch(setIsCamOff(v));
  }, [dispatch]);

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
      <div className="flex justify-center items-center h-[calc(100vh-82px)]">
        <PreviewContent stream={stream} setStream={setStream} isMuted={isMuted} setIsMutedAction={setIsMutedAction} isCamOff={isCamOff} setIsCamOffAction={setIsCamOffAction} username={username} />
      </div>
      <Footer />
    </>
  );
};

export default PreviewPage;
