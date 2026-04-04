import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectIsSignIn, selectInitStatus } from "../store/selectors";

const ProtectedRoute: React.FC = () => {
  const isSignIn = useAppSelector(selectIsSignIn);
  const initStatus = useAppSelector(selectInitStatus);

  if (initStatus === "idle" || initStatus === "loading") {
    return null;
  }

  if (!isSignIn) {
    return <Navigate to="/signIn" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
