import { ActionTypes, AppAction } from "../types/redux";
import { IAttendee, IRecording } from "../types/models";
import { ChatMessage, ClientSchedule } from "../types/redux";

export { ActionTypes };

export const setSelfSocketId = (selfSocketId: string): AppAction => {
  return {
    type: ActionTypes.SET_SELF_SOCKET_ID,
    selfSocketId,
  };
};

export const setIsRoomHost = (isHost: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_ROOM_HOST,
    isHost,
  };
};

export const setRoomId = (roomId: string): AppAction => {
  return {
    type: ActionTypes.SET_ROOM_ID,
    roomId,
  };
};

export const setUsername = (username: string): AppAction => {
  return {
    type: ActionTypes.SET_USERNAME,
    username,
  };
};

export const setAttendees = (attendees: IAttendee[]): AppAction => {
  return {
    type: ActionTypes.SET_ATTENDEES,
    attendees,
  };
};

export const setInitLoading = (initLoading: boolean): AppAction => {
  return {
    type: ActionTypes.SET_INIT_LOADING,
    initLoading,
  };
};

export const setMessages = (messages: ChatMessage[]): AppAction => {
  return {
    type: ActionTypes.SET_MESSAGES,
    messages,
  };
};

export const setIsSignIn = (isSignIn: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_USER_SIGN_IN,
    isSignIn,
  };
};

export const setIsShare = (isShare: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_SHARE,
    isShare,
  };
};

export const setIsRecording = (isRecording: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_RECORDING,
    isRecording,
  };
};

export const setAvatar = (avatar: string): AppAction => {
  return {
    type: ActionTypes.SET_AVATAR,
    avatar,
  };
};

export const setEmail = (email: string): AppAction => {
  return {
    type: ActionTypes.SET_EMAIL,
    email,
  };
};

export const setRecording = (recording: IRecording[] | null): AppAction => {
  return {
    type: ActionTypes.SET_RECORDING,
    recording,
  };
};

export const setSchedule = (schedule: ClientSchedule | null): AppAction => {
  return {
    type: ActionTypes.SET_SCHEDULE,
    schedule,
  };
};

export const setVideoRegionHeight = (videoRegionHeight: number): AppAction => {
  return {
    type: ActionTypes.SET_VIDEO_REGION_HEIGHT,
    videoRegionHeight,
  };
};

export const setVideoRegionWidth = (videoRegionWidth: number): AppAction => {
  return {
    type: ActionTypes.SET_VIDEO_REGION_WIDTH,
    videoRegionWidth,
  };
};

export const setAttendCount = (attendCount: number): AppAction => {
  return {
    type: ActionTypes.SET_ATTENDEE_COUNT,
    attendCount,
  };
};

export const setIsMuted = (isMuted: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_MUTED,
    isMuted,
  };
};

export const setIsCamOff = (isCamOff: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_CAM_OFF,
    isCamOff,
  };
};

export const setIsOtherShare = (isOtherShare: boolean): AppAction => {
  return {
    type: ActionTypes.SET_IS_OTHER_SHARE,
    isOtherShare,
  };
};

export const setDefaultUsername = (defaultUsername: string): AppAction => {
  return {
    type: ActionTypes.SET_DEFAULT_USERNAME,
    defaultUsername,
  };
};

export const setGoogleId = (googleId: string): AppAction => {
  return {
    type: ActionTypes.SET_GOOGLE_ID,
    googleId,
  };
};
