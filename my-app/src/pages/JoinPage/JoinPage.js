import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { setRoomHost } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
import JoinTitle from "./JoinTitle";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";

const JoinPage = (props) => {
  const { setRoomHostAction, isHost, username } = props;
  const search = useLocation().search;

  useEffect(() => {
    const isHost = new URLSearchParams(search).get("host");
    const roomId = new URLSearchParams(search).get("roomId");
    if (isHost) {
      setRoomHostAction(true);
    } else {
      //for other join with a link
      setRoomHostAction(false);
      const inputRoomIdEl = document.querySelector(".input-roomId");
      if (inputRoomIdEl) {
        const templateInputEl = inputRoomIdEl.querySelector(".template-input");
        templateInputEl.value = roomId;
      }
    }
  }, []);

  //use key props to make sure component unmount and remount again, then the usename default value is shown
  return (
    <>
      <Nav />
      <div className="join-container">
        <div className="join-box">
          <JoinTitle isHost={isHost} />
          <JoinContent key={Math.random()} />
        </div>
      </div>
      <Footer />
    </>
  );
};
//props subscript state, auto update if state updated
const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};
// props can direct use action
const mapDispatchToProps = (dispatch) => {
  return {
    setRoomHostAction: (isHost) => dispatch(setRoomHost(isHost)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinPage); //the sequence (mapStoreStateToProps, mapDispatchToProps) is fixed
