import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import peopleImg from "../../assets/images/people.svg";
import Modal from "../Modal";
import Avatar from "./Avatar";

const Nav = ({ isSignIn, setSignInAction }) => {
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

  const signOutHandler = async () => {
    const response = await signOut();
    if (response.ok) {
      setSignInAction(false);
      setOpenModal(true);
      // window.location.href = "/";
    }
  };
  const refreshHandler = async () => {
    const response = await refresh();
    if (response.ok) {
      setSignInAction(true);
    } else {
      setSignInAction(false);
    }
  };

  useEffect(() => {
    //check if have refresh token cookie, then show log in status
    refreshHandler();
  }, []);

  const Drawer = () => {
    return (
      <div className="nav-drawer-container hide">
        <div className="nav-profile drawer-item">Profile</div>
        <div className="nav-recording drawer-item">Recording</div>
        <div className="nav-calendar drawer-item">Calendar</div>
        <div className="nav-signOut drawer-item" onClick={signOutHandler}>
          Sign Out
        </div>
      </div>
    );
  };

  // const test = () => {
  //   //add event listener to drawer
  //   const navAvatarImgEl = document.querySelector(".nav-avatar-img");
  //   const navDrawerContainerEl = document.querySelector(
  //     ".nav-drawer-container"
  //   );

  //   if (navDrawerContainerEl) {
  //     navDrawerContainerEl.classList.toggle("hide");
  //   }
  // };

  return (
    <div className="navigator-container">
      <div className="nav-logo" onClick={logoHandler}>
        Meeting
      </div>
      <div className="nav-function-container">
        <div className="nav-schedule" onClick={scheduleHandler}>
          Schedule
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

      {openModal && (
        <Modal
          modalTitle="Message"
          modalBody="log out success! will redirect to home page"
          btnHandler={() => {
            window.location.href = "/";
            setOpenModal(false);
          }}
          btnText="OK"
        />
      )}
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
    setSignInAction: (isSignIn) => dispatch(setSignIn(isSignIn)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(Nav);
