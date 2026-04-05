import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setIsSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import Avatar from "./Avatar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const Nav: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const avatar = useAppSelector((state) => state.user.avatar);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logoHandler = (): void => { navigate("/"); };
  const signInHandler = (): void => { navigate("/signIn"); };
  const joinPageHandler = (): void => { navigate("/join"); };
  const hostPageHandler = (): void => { navigate("/join?host=true"); };
  const profileHandler = (): void => { navigate("/profile"); };
  const recordingHandler = (): void => { navigate("/recording"); };

  const signOutHandler = async (): Promise<void> => {
    try {
      const response = await signOut();
      if (response.ok) {
        dispatch(setIsSignIn(false));
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
    refreshHandler();
  }, []);

  return (
    <div className="flex justify-between items-center h-[50px] px-5 border-b-2 border-muted">
      <div className="text-primary font-black text-2xl cursor-pointer" onClick={logoHandler}>
        Meeting
      </div>
      <div className="font-semibold flex gap-5">
        <div className="leading-[30px] h-[30px] cursor-pointer border-b-2 border-transparent transition-[border-bottom-color] duration-500 ease-in-out hover:border-primary" onClick={joinPageHandler}>
          Join
        </div>
        <div className="leading-[30px] h-[30px] cursor-pointer border-b-2 border-transparent transition-[border-bottom-color] duration-500 ease-in-out hover:border-primary" onClick={hostPageHandler}>
          Host
        </div>
        {isSignIn ? (
          <>
            <Avatar avatar={avatar} onToggleDrawer={() => setDrawerOpen(!drawerOpen)} />
            {drawerOpen && (
              <div className="absolute top-[50px] right-[30px] flex flex-col rounded-md bg-surface border border-surface-secondary drop-shadow-[0_0_0.2rem_#A0A0A0] cursor-pointer z-[20]">
                <div className="p-[5px] rounded-md cursor-pointer hover:bg-surface-secondary" onClick={profileHandler}>
                  Profile
                </div>
                <div className="p-[5px] rounded-md cursor-pointer hover:bg-surface-secondary" onClick={recordingHandler}>
                  Recording
                </div>
                <div className="p-[5px] rounded-md cursor-pointer hover:bg-surface-secondary" onClick={signOutHandler}>
                  Sign Out
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="leading-[30px] h-[30px] cursor-pointer border-b-2 border-transparent transition-[border-bottom-color] duration-500 ease-in-out hover:border-primary" onClick={signInHandler}>
            Sign In/Up
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
