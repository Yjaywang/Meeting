import { IAttendee, IRecording } from "./models";

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

// ---- Root State (re-exported from store) ----

export type { RootState } from "../store/store";
