// Compatibility re-exports — all action creators from slices
export {
  setDefaultUsername,
  setUsername,
  setGoogleId,
  setAvatar,
  setEmail,
  setIsSignIn,
} from "./slices/userSlice";

export {
  setRoomId,
  setIsRoomHost,
  setSelfSocketId,
  setAttendees,
  setAttendCount,
  incrementAttendCount,
  decrementAttendCount,
  setInitLoading,
} from "./slices/roomSlice";

export {
  setIsMuted,
  setIsCamOff,
  setIsShare,
  setIsOtherShare,
  setIsRecording,
  setVideoRegionHeight,
  setVideoRegionWidth,
} from "./slices/mediaSlice";

export { setMessages, addMessage } from "./slices/chatSlice";

export { setRecording, setSchedule } from "./slices/dataSlice";
