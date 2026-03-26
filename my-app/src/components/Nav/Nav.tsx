import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import Modal from "../Modal/Modal";
import Avatar from "./Avatar";
import { RootState, AppAction } from "../../types/redux";
import { Dispatch } from "redux";

interface NavProps {
  isSignIn: boolean;
  setIsSignInAction: (isSignIn: boolean) => void;
  avatar: string;
}

const Nav: React.FC<NavProps> = ({ isSignIn, setIsSignInAction, avatar }) => {
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
        setIsSignInAction(false);
        setOpenModal(true);
        window.location.href = "/";
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const refreshHandler = async (): Promise<void> => {
    try {
      const response = await refresh();
      if (response.ok) {
        setIsSignInAction(true);
      } else {
        setIsSignInAction(false);
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

//props subscript state, auto update if state updated
const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

// props can direct use action
const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
  return {
    setIsSignInAction: (isSignIn: boolean) => dispatch(setIsSignIn(isSignIn)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(Nav);
