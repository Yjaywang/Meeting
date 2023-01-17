import Actions from "./actions";

const initState = {
  identity: "",
  isHost: false,
};
//action from dispatch, which action come from actions.js return{type...}
const reducer = (state = initState, action) => {
  switch (action.type) {
    case Actions.SET_ROOM_HOST:
      return {
        ...state,
        isHost: action.isHost,
      };
    default:
      return state;
  }
};

export default reducer;
