import { ActionTypes } from "./actions";
import { RootState, AppAction } from "../types/redux";

const initState: RootState = {
  defaultUsername: "",
  username: "",
  googleId: "",
  avatar: "",
  email: "",
  recording: null,
  schedule: null,
  selfSocketId: "",
  roomId: "",
  isHost: false,
  attendees: [],
  attendCount: 0,
  initLoading: true,
  messages: [],
  isSignIn: false,
  isShare: false,
  isOtherShare: false,
  isRecording: false,
  isMuted: true,
  isCamOff: false,
  videoRegionHeight: 0,
  videoRegionWidth: 0,
};

const reducer = (state: RootState = initState, action: AppAction): RootState => {
  switch (action.type) {
    case ActionTypes.SET_IS_ROOM_HOST:
      return {
        ...state,
        isHost: action.isHost,
      };
    case ActionTypes.SET_SELF_SOCKET_ID:
      return {
        ...state,
        selfSocketId: action.selfSocketId,
      };
    case ActionTypes.SET_ROOM_ID:
      return {
        ...state,
        roomId: action.roomId,
      };
    case ActionTypes.SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case ActionTypes.SET_ATTENDEES:
      return {
        ...state,
        attendees: action.attendees,
      };
    case ActionTypes.SET_INIT_LOADING:
      return {
        ...state,
        initLoading: action.initLoading,
      };
    case ActionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case ActionTypes.SET_IS_USER_SIGN_IN:
      return {
        ...state,
        isSignIn: action.isSignIn,
      };
    case ActionTypes.SET_IS_SHARE:
      return {
        ...state,
        isShare: action.isShare,
      };
    case ActionTypes.SET_IS_RECORDING:
      return {
        ...state,
        isRecording: action.isRecording,
      };
    case ActionTypes.SET_AVATAR:
      return {
        ...state,
        avatar: action.avatar,
      };
    case ActionTypes.SET_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case ActionTypes.SET_RECORDING:
      return {
        ...state,
        recording: action.recording,
      };
    case ActionTypes.SET_SCHEDULE:
      return {
        ...state,
        schedule: action.schedule,
      };
    case ActionTypes.SET_VIDEO_REGION_HEIGHT:
      return {
        ...state,
        videoRegionHeight: action.videoRegionHeight,
      };
    case ActionTypes.SET_VIDEO_REGION_WIDTH:
      return {
        ...state,
        videoRegionWidth: action.videoRegionWidth,
      };
    case ActionTypes.SET_ATTENDEE_COUNT:
      return {
        ...state,
        attendCount: action.attendCount,
      };
    case ActionTypes.SET_IS_MUTED:
      return {
        ...state,
        isMuted: action.isMuted,
      };

    case ActionTypes.SET_IS_CAM_OFF:
      return {
        ...state,
        isCamOff: action.isCamOff,
      };
    case ActionTypes.SET_IS_OTHER_SHARE:
      return {
        ...state,
        isOtherShare: action.isOtherShare,
      };
    case ActionTypes.SET_DEFAULT_USERNAME:
      return {
        ...state,
        defaultUsername: action.defaultUsername,
      };

    case ActionTypes.SET_GOOGLE_ID:
      return {
        ...state,
        googleId: action.googleId,
      };

    default:
      return state;
  }
};

export default reducer;
