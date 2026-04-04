import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setIsRoomHost, setRoomId } from "../../store/slices/roomSlice";
import JoinContent from "./JoinContent";
import JoinTitle from "./JoinTitle";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { refresh } from "../../utils/fetchUserApi";
import { useAppDispatch } from "../../store/hooks";

const JoinPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const search = useLocation().search;
  const navigate = useNavigate();

  useEffect(() => {
    const isHost = new URLSearchParams(search).get("host");
    const linkRoomId = new URLSearchParams(search).get("roomId");
    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.ok) {
          if (isHost) {
            dispatch(setIsRoomHost(true));
          } else {
            dispatch(setIsRoomHost(false));
            dispatch(setRoomId(linkRoomId || ""));
          }
        } else {
          navigate("/signIn");
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    checkSignIn();
  }, []);

  return (
    <>
      <Nav />
      <div className="overflow-auto w-full h-[calc(100vh-82px)] flex items-center justify-center">
        <div className="w-[400px] pb-[30px] bg-surface border border-surface-secondary drop-shadow-[0_0_0.2rem_#A0A0A0] flex flex-col items-center justify-between rounded-md max-[500px]:w-[90%]">
          <JoinTitle newIsHost={new URLSearchParams(search).get("host")} />
          <JoinContent key={Math.random()} newIsHost={new URLSearchParams(search).get("host")} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JoinPage;
