import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setIsSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import Modal from "../Modal/Modal";
import Avatar from "./Avatar";

const Nav = ({ isSignIn, setIsSignInAction, avatar }) => {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);

  const logoHandler = () => {
    history.push("/");
  };

  const signInHandler = () => {
    history.push("/signIn");
  };
  const joinPageHandler = () => {
    history.push("/join");
  };
  const hostPageHandler = () => {
    history.push("/join?host=true");
  };
  const profileHandler = () => {
    history.push("/profile");
  };
  const recordingHandler = () => {
    history.push("/recording");
  };
  const signOutHandler = async () => {
    const response = await signOut();
    if (response.ok) {
      setIsSignInAction(false);
      setOpenModal(true);
      window.location.href = "/";
    }
  };
  const refreshHandler = async () => {
    const response = await refresh();
    if (response.ok) {
      setIsSignInAction(true);
    } else {
      setIsSignInAction(false);
    }
  };

  useEffect(() => {
    //check if have refresh token cookie, then show log in status
    refreshHandler();
  }, []);

  const Drawer = () => {
    return (
      <div className="nav-drawer-container hide">
        <div className="nav-profile drawer-item" onClick={profileHandler}>
          Profile
        </div>
        <div className="nav-recording drawer-item" onClick={recordingHandler}>
          Recording
        </div>
        {/* <div className="nav-calendar drawer-item">Calendar</div> */}
        <div className="nav-signOut drawer-item" onClick={signOutHandler}>
          Sign Out
        </div>
      </div>
    );
  };

  return (
    <div className="navigator-container">
      <div className="nav-logo" onClick={logoHandler}>
        Meeting
      </div>
      <div className="nav-function-container">
        {/* <div className="nav-schedule" onClick={scheduleHandler}>
          Schedule
        </div> */}
        <div className="nav-join" onClick={joinPageHandler}>
          Join
        </div>
        <div className="nav-host" onClick={hostPageHandler}>
          Host
        </div>
        {isSignIn ? (
          <>
            <Avatar key={Math.random()} avatar={avatar} />
            <Drawer />
          </>
        ) : (
          <div className="nav-signIn-Up" onClick={signInHandler}>
            Sign In/Up
          </div>
        )}
      </div>

      {/* {openModal && (
        <Modal
          modalTitle="Message"
          modalBody="log out success! will redirect to home page"
          btnHandler={() => {
            window.location.href = "/";
            setOpenModal(false);
          }}
          btnText="OK"
        />
      )} */}
    </div>
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
    setIsSignInAction: (isSignIn) => dispatch(setIsSignIn(isSignIn)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(Nav);
