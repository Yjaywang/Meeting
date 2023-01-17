import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { setRoomHost } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
import JoinTitle from "./JoinTitle";

const JoinPage = (props) => {
  const { setRoomHostAction, isHost } = props;
  console.log(props);
  const search = useLocation().search;

  useEffect(() => {
    const isHost = new URLSearchParams(search).get("host");
    if (isHost) {
      setRoomHostAction(true);
    } else {
      setRoomHostAction(false);
    }
  });
  return (
    <div className="join-container">
      <div className="join-box">
        <JoinTitle isHost={isHost} />
        <JoinContent />
      </div>
    </div>
  );
};
//props subscript state, auto update if state update
const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};
// pros can direct use action
const mapDispatchToProps = (dispatch) => {
  return {
    setRoomHostAction: (isHost) => dispatch(setRoomHost(isHost)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinPage); //the sequence (mapStoreStateToProps, mapDispatchToProps) is fixed
