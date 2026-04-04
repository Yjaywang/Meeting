import React from "react";
import landingPageImg1 from "../../assets/images/landing-page-use-1.jpg";
import landingPageImg2 from "../../assets/images/landing-page-use-2.jpg";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const Screen1: React.FC = () => {
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const navigate = useNavigate();
  function pushToSignInHandler() {
    navigate("/signIn");
  }
  function pushToSignUpHandler() {
    navigate("/signUp");
  }
  function hostHandler() {
    navigate("/join?host=true");
  }
  function joinHandler() {
    navigate("/join");
  }
  return (
    <div className="flex justify-center items-center h-[calc(100vh-152px)]">
      <div className="screen-1-inner-container w-[1200px] overflow-hidden flex items-center justify-center gap-5 mx-auto max-[1200px]:w-[95%] max-[820px]:flex-col">
        <div className="screen-1-left-container max-[570px]:w-[330px]">
          <div className="text-4xl font-bold">
            Let's <span className="text-primary">Meeting</span>
            <span>, let's be together</span>
          </div>
          <div className="screen-1-description mt-[50px] leading-[30px] text-xl">
            <div>Break the distance, link to each other, </div>
            <div>we're in the same place.</div>
            <div>All you need is on the Meeting platform.</div>
          </div>
          <div className="screen-1-btn-container flex gap-[50px] mt-[50px] items-center max-[570px]:gap-5">
            {isSignIn ? (
              <>
                <div className="flex justify-center items-center w-[170px] h-[50px] bg-primary rounded-md border-none font-bold text-surface transition-all duration-300 cursor-pointer hover:bg-primary-hover" onClick={hostHandler}>
                  Host a meeting
                </div>
                <div className="flex justify-center items-center w-[170px] h-[50px] bg-primary rounded-md border-none font-bold text-surface transition-all duration-300 cursor-pointer hover:bg-primary-hover" onClick={joinHandler}>
                  Join the meeting
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex justify-center items-center w-[150px] h-[50px] bg-primary rounded-md border-none font-bold text-surface transition-all duration-300 cursor-pointer hover:bg-primary-hover"
                  onClick={pushToSignInHandler}
                >
                  Sign In
                </div>
                <div
                  className="cursor-pointer text-primary transition-all duration-300 hover:text-primary-hover hover:underline max-[570px]:text-sm"
                  onClick={pushToSignUpHandler}
                >
                  no account? sign Up here
                </div>
              </>
            )}
          </div>
        </div>
        <div className="screen-1-right-container h-[583px] relative w-[500px] max-[820px]:h-[350px] max-[570px]:w-[330px] max-[570px]:h-[280px]">
          <div>
            <img className="screen-1-img-1 w-full object-cover rounded-xl drop-shadow-[0_0_0.2rem_gray] max-[1200px]:w-[90%] max-[1200px]:mt-[50px] max-[820px]:w-[60%] max-[570px]:w-[60%]" src={landingPageImg1} alt="" />
          </div>
          <div>
            <img className="screen-1-img-2 w-full object-cover rounded-xl drop-shadow-[0_0_0.2rem_gray] absolute top-[250px] left-[50px] -z-[1] max-[1200px]:w-[85%] max-[820px]:w-[65%] max-[820px]:top-[100px] max-[820px]:left-[150px] max-[570px]:w-[65%] max-[570px]:left-[100px]" src={landingPageImg2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen1;
