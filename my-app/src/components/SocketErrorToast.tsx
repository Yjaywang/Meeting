import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSocketError } from "../store/slices/roomSlice";

const SocketErrorToast: React.FC = () => {
  const socketError = useAppSelector((state) => state.room.socketError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socketError) return;
    const timer = setTimeout(() => {
      dispatch(setSocketError(""));
    }, 5000);
    return () => clearTimeout(timer);
  }, [socketError, dispatch]);

  if (!socketError) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-danger text-white px-5 py-3 rounded-md shadow-lg text-sm animate-fade-in">
      {socketError}
    </div>
  );
};

export default SocketErrorToast;
