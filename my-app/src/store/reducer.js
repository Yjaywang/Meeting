import Actions from "./actions";

const initState = {
  username: "",
  roomId: null,
  isHost: false,
  initLoading: true,
};
//action from dispatch, which action come from actions.js return{type...}
const reducer = (state = initState, action) => {
  switch (action.type) {
    case Actions.SET_ROOM_HOST:
      return {
        ...state,
        isHost: action.isHost,
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
    case Actions.SET_INIT_LOADING:
      return {
        ...state,
        initLoading: action.initLoading,
      };
    default:
      return state;
  }
};

export default reducer;
