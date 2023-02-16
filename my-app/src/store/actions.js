const Actions = {
  SET_IS_ROOM_HOST: "SET_IS_ROOM_HOST",
  SET_USERNAME: "SET_USERNAME",
  SET_ROOM_ID: "SET_ROOM_ID",
  SET_INIT_LOADING: "SET_INIT_LOADING",
  SET_ATTENDEES: "SET_ATTENDEES",
  SET_MESSAGES: "SET_MESSAGES",
  SET_SELF_SOCKET_ID: "SET_SELF_SOCKET_ID",
  SET_IS_USER_SIGN_IN: "SET_IS_USER_SIGN_IN",
  SET_IS_SHARE: "SET_IS_SHARE",
  SET_IS_RECORDING: "SET_IS_RECORDING",
  SET_AVATAR: "SET_AVATAR",
  SET_EMAIL: "SET_EMAIL",
  SET_RECORDING: "SET_RECORDING",
  SET_SCHEDULE: "SET_SCHEDULE",
};

export const setSelfSocketId = (selfSocketId) => {
  return {
    type: Actions.SET_SELF_SOCKET_ID,
    selfSocketId,
  };
};

export const setIsRoomHost = (isHost) => {
  return {
    type: Actions.SET_IS_ROOM_HOST,
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

export const setIsSignIn = (isSignIn) => {
  return {
    type: Actions.SET_IS_USER_SIGN_IN,
    isSignIn,
  };
};

export const setIsShare = (isShare) => {
  return {
    type: Actions.SET_IS_SHARE,
    isShare,
  };
};

export const setIsRecording = (isRecording) => {
  return {
    type: Actions.SET_IS_RECORDING,
    isRecording,
  };
};

export const setAvatar = (avatar) => {
  return {
    type: Actions.SET_AVATAR,
    avatar,
  };
};

export const setEmail = (email) => {
  return {
    type: Actions.SET_EMAIL,
    email,
  };
};

export const setRecording = (recording) => {
  return {
    type: Actions.SET_RECORDING,
    recording,
  };
};

export const setSchedule = (schedule) => {
  return {
    type: Actions.SET_SCHEDULE,
    schedule,
  };
};

export default Actions;
