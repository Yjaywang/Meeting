const Actions = {
  SET_ROOM_HOST: "SET_ROOM_HOST",
};

export const setRoomHost = (isHost) => {
  return {
    type: Actions.SET_ROOM_HOST,
    isHost,
  };
};

export default Actions;
