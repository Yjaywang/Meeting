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
  SET_VIDEO_REGION_HEIGHT: "SET_VIDEO_REGION_HEIGHT",
  SET_VIDEO_REGION_WIDTH: "SET_VIDEO_REGION_WIDTH",
  SET_ATTENDEE_COUNT: "SET_ATTENDEE_COUNT",
  SET_IS_MUTED: "SET_IS_MUTED",
  SET_IS_CAM_OFF: "SET_IS_CAM_OFF",
  SET_IS_OTHER_SHARE: "SET_IS_OTHER_SHARE",
  SET_DEFAULT_USERNAME: "SET_DEFAULT_USERNAME",
  SET_GOOGLE_ID: "SET_GOOGLE_ID",
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

export const setVideoRegionHeight = (videoRegionHeight) => {
  return {
    type: Actions.SET_VIDEO_REGION_HEIGHT,
    videoRegionHeight,
  };
};

export const setVideoRegionWidth = (videoRegionWidth) => {
  return {
    type: Actions.SET_VIDEO_REGION_WIDTH,
    videoRegionWidth,
  };
};

export const setAttendCount = (attendCount) => {
  return {
    type: Actions.SET_ATTENDEE_COUNT,
    attendCount,
  };
};

export const setIsMuted = (isMuted) => {
  return {
    type: Actions.SET_IS_MUTED,
    isMuted,
  };
};

export const setIsCamOff = (isCamOff) => {
  return {
    type: Actions.SET_IS_CAM_OFF,
    isCamOff,
  };
};

export const setIsOtherShare = (isOtherShare) => {
  return {
    type: Actions.SET_IS_OTHER_SHARE,
    isOtherShare,
  };
};

export const setDefaultUsername = (defaultUsername) => {
  return {
    type: Actions.SET_DEFAULT_USERNAME,
    defaultUsername,
  };
};

export const setGoogleId = (googleId) => {
  return {
    type: Actions.SET_GOOGLE_ID,
    googleId,
  };
};

export default Actions;
