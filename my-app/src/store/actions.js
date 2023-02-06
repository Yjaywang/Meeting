const Actions = {
  SET_ROOM_HOST: "SET_ROOM_HOST",
  SET_USERNAME: "SET_USERNAME",
  SET_ROOM_ID: "SET_ROOM_ID",
  SET_INIT_LOADING: "SET_INIT_LOADING",
  SET_ATTENDEES: "SET_ATTENDEES",
  SET_MESSAGES: "SET_MESSAGES",
  SET_SELF_SOCKET_ID: "SET_SELF_SOCKET_ID",
  SET_USER_SIGN_IN: "SET_USER_SIGN_IN",
  SET_SCREEN_SHARE: "SET_SCREEN_SHARE",
  SET_SCREEN_RECORDING: "SET_SCREEN_RECORDING",
  SET_SCREEN_STREAM: "SET_SCREEN_STREAM",
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

export const setScreenShare = (isShare) => {
  return {
    type: Actions.SET_SCREEN_SHARE,
    isShare,
  };
};

export const setScreenRecording = (isRecording) => {
  return {
    type: Actions.SET_SCREEN_RECORDING,
    isRecording,
  };
};

export const setScreenStream = (screenStream) => {
  return {
    type: Actions.SET_SCREEN_STREAM,
    screenStream,
  };
};

export default Actions;
