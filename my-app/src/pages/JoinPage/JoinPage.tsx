import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setIsRoomHost, setRoomId } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
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
      <div className="join-container">
        <div className="join-box">
          <JoinTitle newIsHost={new URLSearchParams(search).get("host")} />
          <JoinContent key={Math.random()} newIsHost={new URLSearchParams(search).get("host")} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JoinPage;
