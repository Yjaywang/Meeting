const Actions = {
  SET_ROOM_HOST: "SET_ROOM_HOST",
  SET_USERNAME: "SET_USERNAME",
  SET_ROOM_ID: "SET_ROOM_ID",
  SET_INIT_LOADING: "SET_INIT_LOADING",
  SET_ATTENDEES: "SET_ATTENDEES",
  SET_MESSAGES: "SET_MESSAGES",
  SET_SELF_SOCKET_ID: "SET_SELF_SOCKET_ID",
  SET_USER_SIGN_IN: "SET_USER_SIGN_IN",
  SET_SHARE: "SET_SHARE",
  SET_RECORDING: "SET_RECORDING",
};

export const setSelfSocketId = (selfSocketId) => {
  return {
    type: Actions.SET_SELF_SOCKET_ID,
    selfSocketId,
  };
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

export const setAttendees = (attendees) => {
  return {
    type: Actions.SET_ATTENDEES,
    attendees,
  };
};

export const setInitLoading = (initLoading) => {
  return {
    type: Actions.SET_INIT_LOADING,
    initLoading,
  };
};

export const setMessages = (messages) => {
  return {
    type: Actions.SET_MESSAGES,
    messages,
  };
};

export const setSignIn = (isSignIn) => {
  return {
    type: Actions.SET_USER_SIGN_IN,
    isSignIn,
  };
};

export const setShare = (isShare) => {
  return {
    type: Actions.SET_SHARE,
    isShare,
  };
};

export const setRecording = (isRecording) => {
  return {
    type: Actions.SET_RECORDING,
    isRecording,
  };
};

export default Actions;
