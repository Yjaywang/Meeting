import Actions from "./actions";

const initState = {
  username: "",
  selfSocketId: "",
  roomId: null,
  isHost: false,
  attendees: [],
  initLoading: true,
  messages: [],
  isSignIn: false,
};
//action from dispatch, which action come from actions.js return{type...}
const reducer = (state = initState, action) => {
  switch (action.type) {
    case Actions.SET_ROOM_HOST:
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
    case Actions.SET_USER_SIGN_IN:
      return {
        ...state,
        isSignIn: action.isSignIn,
      };
    default:
      return state;
  }
};

export default reducer;
