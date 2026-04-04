import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";

const MemberLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname === "/profile";
  const isRecording = location.pathname === "/recording";

  return (
    <div>
      <Nav />
      <div className="w-[1200px] mx-auto mt-5 flex h-[calc(100vh-102px)] overflow-hidden max-[1200px]:w-full">
        <div className="w-[150px] bg-surface-secondary transition-all duration-300 font-bold max-[700px]:hidden">
          <div
            className={`transition-colors duration-300 p-2.5 cursor-pointer hover:text-primary-hover ${isProfile ? "!bg-primary !text-white" : ""}`}
            onClick={() => navigate("/profile")}
          >
            Profile
          </div>
          <div
            className={`transition-colors duration-300 p-2.5 cursor-pointer hover:text-primary-hover ${isRecording ? "!bg-primary !text-white" : ""}`}
            onClick={() => navigate("/recording")}
          >
            Recording
          </div>
        </div>
        <div className="flex-auto px-8 py-8 max-[1200px]:px-6 overflow-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemberLayout;
