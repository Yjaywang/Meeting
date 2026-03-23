import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { setIsRoomHost, setRoomId } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
import JoinTitle from "./JoinTitle";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { useHistory } from "react-router-dom";
import { refresh } from "../../utils/fetchUserApi";
import { RootState, AppAction } from "../../types/redux";
import { Dispatch } from "redux";

interface JoinPageProps {
  setIsRoomHostAction: (isHost: boolean) => void;
  setRoomIdAction: (roomId: string) => void;
}

const JoinPage: React.FC<JoinPageProps> = (props) => {
  const { setIsRoomHostAction, setRoomIdAction } = props;
  const search = useLocation().search;
  const history = useHistory();

  useEffect(() => {
    const isHost = new URLSearchParams(search).get("host");
    const linkRoomId = new URLSearchParams(search).get("roomId");
    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.ok) {
          if (isHost) {
            setIsRoomHostAction(true);
          } else {
            //for other join with a link
            setIsRoomHostAction(false);
            setRoomIdAction(linkRoomId as string);
          }
        } else {
          history.push("/signin");
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    checkSignIn();
  }, []);

  //use key props to make sure component unmount and remount again, then the usename default value is shown
  return (
    <>
      <Nav />
      <div className="join-container">
        <div className="join-box">
          <JoinTitle newIsHost={new URLSearchParams(search).get("host")} />
          <JoinContent
            key={Math.random()}
            newIsHost={new URLSearchParams(search).get("host")}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};
//props subscript state, auto update if state updated
const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};
// props can direct use action
const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
  return {
    setIsRoomHostAction: (isHost: boolean) => dispatch(setIsRoomHost(isHost)),
    setRoomIdAction: (roomId: string) => dispatch(setRoomId(roomId)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinPage); //the sequence (mapStoreStateToProps, mapDispatchToProps) is fixed
