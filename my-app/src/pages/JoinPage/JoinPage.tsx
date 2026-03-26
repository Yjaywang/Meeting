import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setIsRoomHost, setRoomId } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
import JoinTitle from "./JoinTitle";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { refresh } from "../../utils/fetchUserApi";
import { RootState, AppAction } from "../../types/redux";
import { Dispatch } from "redux";

interface JoinPageProps {
  setIsRoomHostAction?: (isHost: boolean) => void;
  setRoomIdAction?: (roomId: string) => void;
}

const JoinPage: React.FC<JoinPageProps> = (props) => {
  const { setIsRoomHostAction, setRoomIdAction } = props;
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
            setIsRoomHostAction?.(true);
          } else {
            setIsRoomHostAction?.(false);
            setRoomIdAction?.(linkRoomId || "");
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

const mapStoreStateToProps = (state: RootState) => { return { ...state }; };
const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
  return {
    setIsRoomHostAction: (isHost: boolean) => dispatch(setIsRoomHost(isHost)),
    setRoomIdAction: (roomId: string) => dispatch(setRoomId(roomId)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinPage);
