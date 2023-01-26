import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { setRoomHost } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
import JoinTitle from "./JoinTitle";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const JoinPage = (props) => {
  const { setRoomHostAction, isHost } = props;
  const search = useLocation().search;

  useEffect(() => {
    const isHost = new URLSearchParams(search).get("host");
    if (isHost) {
      setRoomHostAction(true);
    } else {
      setRoomHostAction(false);
    }
  }, []);
  return (
    <>
      <Nav />
      <div className="join-container">
        <div className="join-box">
          <JoinTitle isHost={isHost} />
          <JoinContent />
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
