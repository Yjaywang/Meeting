const Actions = {
  SET_ROOM_HOST: "SET_ROOM_HOST",
  SET_USERNAME: "SET_USERNAME",
  SET_ROOM_ID: "SET_ROOM_ID",
  SET_INIT_LOADING: "SET_INIT_LOADING",
};

export const setRoomHost = (isHost) => {
  return {
    type: Actions.SET_ROOM_HOST,
    isHost,
  };
};

export const setRoomId = (roomId) => {
  return {
    type: Actions.SET_ROOM_ID,
    roomId,
  };
};

export const setUsername = (username) => {
  return {
    type: Actions.SET_USERNAME,
    username,
  };
};

export const setInitLoading = (initLoading) => {
  return {
    type: Actions.SET_INIT_LOADING,
    initLoading,
  };
};

export default Actions;
