import Actions from "./actions";

const initState = {
  username: "",
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
  isMuted: false,
  isCamOff: false,
  videoRegionHeight: 0,
  videoRegionWidth: 0,
};
//action from dispatch, which action come from actions.js return{type...}
const reducer = (state = initState, action) => {
  switch (action.type) {
    case Actions.SET_IS_ROOM_HOST:
      return {
        ...state,
        isHost: action.isHost,
      };
    case Actions.SET_SELF_SOCKET_ID:
      return {
        ...state,
        selfSocketId: action.selfSocketId,
      };
    case Actions.SET_ROOM_ID:
      return {
        ...state,
        roomId: action.roomId,
      };
    case Actions.SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case Actions.SET_ATTENDEES:
      return {
        ...state,
        attendees: action.attendees,
      };
    case Actions.SET_INIT_LOADING:
      return {
        ...state,
        initLoading: action.initLoading,
      };
    case Actions.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case Actions.SET_IS_USER_SIGN_IN:
      return {
        ...state,
        isSignIn: action.isSignIn,
      };
    case Actions.SET_IS_SHARE:
      return {
        ...state,
        isShare: action.isShare,
      };
    case Actions.SET_IS_RECORDING:
      return {
        ...state,
        isRecording: action.isRecording,
      };
    case Actions.SET_AVATAR:
      return {
        ...state,
        avatar: action.avatar,
      };
    case Actions.SET_EMAIL:
      return {
        ...state,
        email: action.email,
      };
    case Actions.SET_RECORDING:
      return {
        ...state,
        recording: action.recording,
      };
    case Actions.SET_SCHEDULE:
      return {
        ...state,
        schedule: action.schedule,
      };
    case Actions.SET_VIDEO_REGION_HEIGHT:
      return {
        ...state,
        videoRegionHeight: action.videoRegionHeight,
      };
    case Actions.SET_VIDEO_REGION_WIDTH:
      return {
        ...state,
        videoRegionWidth: action.videoRegionWidth,
      };
    case Actions.SET_ATTENDEE_COUNT:
      return {
        ...state,
        attendCount: action.attendCount,
      };
    case Actions.SET_IS_MUTED:
      return {
        ...state,
        isMuted: action.isMuted,
      };

    case Actions.SET_IS_CAM_OFF:
      return {
        ...state,
        isCamOff: action.isCamOff,
      };
    case Actions.SET_IS_OTHER_SHARE:
      return {
        ...state,
        isOtherShare: action.isOtherShare,
      };

    default:
      return state;
  }
};

export default reducer;
