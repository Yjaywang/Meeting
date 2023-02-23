import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setDefaultUsername, setIsSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import Modal from "../Modal/Modal";
import Avatar from "./Avatar";
import * as fetchUserApi from "../../utils/fetchUserApi";
import {
  setAvatar,
  setEmail,
  setRecording,
  setSchedule,
  setUsername,
} from "../../store/actions";

const Nav = ({
  isSignIn,
  setIsSignInAction,
  setAvatarAction,
  setEmailAction,
  setDefaultUsernameAction,
  setRecordingAction,
  setScheduleAction,
}) => {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const logoHandler = () => {
    history.push("/");
  };
  const scheduleHandler = () => {
    history.push("/startSchedule");
  };
  const signInHandler = () => {
    history.push("/signIn");
  };
  const joinPageHandler = () => {
    window.location.href = "/join";
  };
  const hostPageHandler = () => {
    window.location.href = "/join?host=true";
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

    async function getAvatar() {
      try {
        const response = await fetchUserApi.getUserInfo();
        if (response.error) {
          return;
        }
        //set data to redux
        setDefaultUsernameAction(response.data.username);
        setEmailAction(response.data.email);
        setAvatarAction(response.data.avatar);
      } catch (error) {
        console.error("error ", error);
      }
    }
    getAvatar();
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
            <Avatar key={Math.random()} />
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
    setAvatarAction: (avatar) => dispatch(setAvatar(avatar)),
    setEmailAction: (email) => dispatch(setEmail(email)),
    setDefaultUsernameAction: (username) =>
      dispatch(setDefaultUsername(username)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(Nav);
