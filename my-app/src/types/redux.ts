import { IAttendee, IRecording } from "./models";

// ---- Action Types ----

export const ActionTypes = {
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
} as const;

// ---- Chat Message ----

export interface ChatMessage {
  content: string;
  username: string;
  selfSocketId: string;
  avatar: string;
  createByMe?: boolean;
  roomId?: string;
}

// ---- Schedule ----

export interface ClientSchedule {
  [key: string]: unknown;
}

// ---- Root State ----

export interface RootState {
  defaultUsername: string;
  username: string;
  googleId: string;
  avatar: string;
  email: string;
  recording: IRecording[] | null;
  schedule: ClientSchedule | null;
  selfSocketId: string;
  roomId: string;
  isHost: boolean;
  attendees: IAttendee[];
  attendCount: number;
  initLoading: boolean;
  messages: ChatMessage[];
  isSignIn: boolean;
  isShare: boolean;
  isOtherShare: boolean;
  isRecording: boolean;
  isMuted: boolean;
  isCamOff: boolean;
  videoRegionHeight: number;
  videoRegionWidth: number;
}

// ---- Discriminated Union Actions ----

export type AppAction =
  | { type: typeof ActionTypes.SET_IS_ROOM_HOST; isHost: boolean }
  | { type: typeof ActionTypes.SET_SELF_SOCKET_ID; selfSocketId: string }
  | { type: typeof ActionTypes.SET_ROOM_ID; roomId: string }
  | { type: typeof ActionTypes.SET_USERNAME; username: string }
  | { type: typeof ActionTypes.SET_ATTENDEES; attendees: IAttendee[] }
  | { type: typeof ActionTypes.SET_INIT_LOADING; initLoading: boolean }
  | { type: typeof ActionTypes.SET_MESSAGES; messages: ChatMessage[] }
  | { type: typeof ActionTypes.SET_IS_USER_SIGN_IN; isSignIn: boolean }
  | { type: typeof ActionTypes.SET_IS_SHARE; isShare: boolean }
  | { type: typeof ActionTypes.SET_IS_RECORDING; isRecording: boolean }
  | { type: typeof ActionTypes.SET_AVATAR; avatar: string }
  | { type: typeof ActionTypes.SET_EMAIL; email: string }
  | { type: typeof ActionTypes.SET_RECORDING; recording: IRecording[] | null }
  | { type: typeof ActionTypes.SET_SCHEDULE; schedule: ClientSchedule | null }
  | { type: typeof ActionTypes.SET_VIDEO_REGION_HEIGHT; videoRegionHeight: number }
  | { type: typeof ActionTypes.SET_VIDEO_REGION_WIDTH; videoRegionWidth: number }
  | { type: typeof ActionTypes.SET_ATTENDEE_COUNT; attendCount: number }
  | { type: typeof ActionTypes.SET_IS_MUTED; isMuted: boolean }
  | { type: typeof ActionTypes.SET_IS_CAM_OFF; isCamOff: boolean }
  | { type: typeof ActionTypes.SET_IS_OTHER_SHARE; isOtherShare: boolean }
  | { type: typeof ActionTypes.SET_DEFAULT_USERNAME; defaultUsername: string }
  | { type: typeof ActionTypes.SET_GOOGLE_ID; googleId: string };
