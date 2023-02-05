import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setSignIn } from "../store/actions";
import { refresh, signOut } from "../utils/fetchUserApi";

const Nav = ({ isSignIn, setSignInAction }) => {
  const history = useHistory();
  const logoHandler = () => {
    history.push("/");
  };
  const scheduleHandler = () => {
    history.push("/schedule");
  };
  const signInHandler = () => {
    history.push("/signIn");
  };

  const signOutHandler = async () => {
    const response = await signOut();
    if (response.ok) {
      setSignInAction(false);
      window.location.href = "/";
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
  //check if have refresh token cookie, then show log in status
  useEffect(() => {
    refreshHandler();
  }, []);

  return (
    <div className="navigator-container">
      <div className="nav-logo" onClick={logoHandler}>
        Meeting
      </div>
      <div className="nav-function-container">
        <div className="schedule" onClick={scheduleHandler}>
          Schedule
        </div>
        {isSignIn ? (
          <div className="signOut" onClick={signOutHandler}>
            Sign Out
          </div>
        ) : (
          <div className="signIn-Up" onClick={signInHandler}>
            Sign In/Up
          </div>
        )}
      </div>
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
