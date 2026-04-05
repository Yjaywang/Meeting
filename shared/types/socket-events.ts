import { IAttendee } from "./models";

// ---- Socket.IO Event Payloads ----

export interface HostMeetingPayload {
  isHost: boolean;
  username: string;
  avatar: string;
}

export interface JoinMeetingPayload {
  isHost: boolean;
  username: string;
  roomId: string;
  avatar: string;
}

export interface ConnectSignalPayload {
  connUserSocketId: string;
  signal: unknown;
}

export interface ConnectStartPayload {
  connUserSocketId: string;
}

export interface ConnectStartResponse {
  connUserSocketId: string;
  username: string;
}

export interface ConnectRequestPayload {
  connUserSocketId: string;
  username: string;
}

export interface RoomUpdatePayload {
  attendees: IAttendee[];
}

export interface SelfSocketIdPayload {
  selfSocketId: string;
}

export interface RoomIdPayload {
  roomId: string;
}

export interface UserLeavePayload {
  socketId: string;
}

// ---- State broadcast payloads ----

export interface RoomBroadcastPayload {
  roomId: string;
}

export interface EmotionPayload extends RoomBroadcastPayload {
  emotion: number;
  socketId: string;
}

export interface ShareStatePayload extends RoomBroadcastPayload {
  isShare: boolean;
  socketId: string;
}

export interface RecordingStatePayload extends RoomBroadcastPayload {
  isRecording: boolean;
  socketId: string;
}

export interface CamStatePayload extends RoomBroadcastPayload {
  isCamOff: boolean;
  socketId: string;
}

export interface MicStatePayload extends RoomBroadcastPayload {
  isMuted: boolean;
  socketId: string;
}

export interface MicVolumePayload extends RoomBroadcastPayload {
  volume: number;
  socketId: string;
}

export interface ChatMessagePayload extends RoomBroadcastPayload {
  message: string;
  username: string;
  socketId: string;
}

// ---- Init state payloads (sent to new comer) ----

export interface InitVideoStatePayload {
  newComerSocketId: string;
  isCamOff: boolean;
  socketId: string;
}

export interface InitAudioStatePayload {
  newComerSocketId: string;
  isMuted: boolean;
  socketId: string;
}

export interface InitSharingStatePayload {
  newComerSocketId: string;
  isShare: boolean;
  socketId: string;
}

export interface InitRecordingStatePayload {
  newComerSocketId: string;
  isRecording: boolean;
  socketId: string;
}

// ---- Socket.IO Typed Event Maps ----

export interface ClientToServerEvents {
  hostMeeting: (info: HostMeetingPayload) => void;
  joinMeeting: (info: JoinMeetingPayload) => void;
  disconnect: () => void;
  connectSignal: (data: ConnectSignalPayload) => void;
  connectStart: (data: ConnectStartPayload) => void;
  sendEmotion: (data: EmotionPayload) => void;
  sendShareState: (data: ShareStatePayload) => void;
  sendRecordingState: (data: RecordingStatePayload) => void;
  sendCamState: (data: CamStatePayload) => void;
  sendMicState: (data: MicStatePayload) => void;
  sendMicVolume: (data: MicVolumePayload) => void;
  sendChatMessage: (data: ChatMessagePayload) => void;
  sendInitVideoStateToPeer: (data: InitVideoStatePayload) => void;
  sendInitAudioStateToPeer: (data: InitAudioStatePayload) => void;
  sendInitSharingStateToPeer: (data: InitSharingStatePayload) => void;
  sendInitRecordingStateToPeer: (data: InitRecordingStatePayload) => void;
}

export interface SocketErrorPayload {
  message: string;
}

export interface ServerToClientEvents {
  socketError: (data: SocketErrorPayload) => void;
  selfSocketId: (data: SelfSocketIdPayload) => void;
  roomId: (data: RoomIdPayload) => void;
  roomUpdate: (data: RoomUpdatePayload) => void;
  connectRequest: (data: ConnectRequestPayload) => void;
  connectSignal: (data: ConnectSignalPayload) => void;
  connectStart: (data: ConnectStartResponse) => void;
  userLeave: (data: UserLeavePayload) => void;
  sendEmotion: (data: EmotionPayload) => void;
  sendShareState: (data: ShareStatePayload) => void;
  sendRecordingState: (data: RecordingStatePayload) => void;
  sendCamState: (data: CamStatePayload) => void;
  sendMicState: (data: MicStatePayload) => void;
  sendMicVolume: (data: MicVolumePayload) => void;
  sendChatMessage: (data: ChatMessagePayload) => void;
  sendInitVideoStateToPeer: (data: InitVideoStatePayload) => void;
  sendInitAudioStateToPeer: (data: InitAudioStatePayload) => void;
  sendInitSharingStateToPeer: (data: InitSharingStatePayload) => void;
  sendInitRecordingStateToPeer: (data: InitRecordingStatePayload) => void;
}
