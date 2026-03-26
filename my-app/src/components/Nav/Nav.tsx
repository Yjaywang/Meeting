import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setIsSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import Modal from "../Modal/Modal";
import Avatar from "./Avatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const Nav: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const avatar = useAppSelector((state) => state.user.avatar);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const logoHandler = (): void => {
    navigate("/");
  };

  const signInHandler = (): void => {
    navigate("/signIn");
  };
  const joinPageHandler = (): void => {
    navigate("/join");
  };
  const hostPageHandler = (): void => {
    navigate("/join?host=true");
  };
  const profileHandler = (): void => {
    navigate("/profile");
  };
  const recordingHandler = (): void => {
    navigate("/recording");
  };
  const signOutHandler = async (): Promise<void> => {
    try {
      const response = await signOut();
      if (response.ok) {
        dispatch(setIsSignIn(false));
        setOpenModal(true);
        navigate("/");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const refreshHandler = async (): Promise<void> => {
    try {
      const response = await refresh();
      if (response.ok) {
        dispatch(setIsSignIn(true));
      } else {
        dispatch(setIsSignIn(false));
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    //check if have refresh token cookie, then show log in status
    refreshHandler();
  }, []);

  const Drawer: React.FC = () => {
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

export default Nav;
