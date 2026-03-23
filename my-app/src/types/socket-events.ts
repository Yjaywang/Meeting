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
  username?: string;
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
  emotion: string;
  selfSocketId: string;
}

export interface ShareStatePayload extends RoomBroadcastPayload {
  isShare: boolean;
  isCamOff: boolean;
  selfSocketId: string;
}

export interface RecordingStatePayload extends RoomBroadcastPayload {
  isRecording: boolean;
  selfSocketId: string;
}

export interface CamStatePayload extends RoomBroadcastPayload {
  isCamOff: boolean;
  selfSocketId: string;
}

export interface MicStatePayload extends RoomBroadcastPayload {
  isMuted: boolean;
  selfSocketId: string;
}

export interface MicVolumePayload extends RoomBroadcastPayload {
  result: string;
  selfSocketId: string;
  avgAudioLevel: number;
}

export interface ChatMessagePayload extends RoomBroadcastPayload {
  content: string;
  username: string;
  selfSocketId: string;
  avatar: string;
  createByMe?: boolean;
}

// ---- Init state payloads (sent to new comer) ----

export interface InitVideoStatePayload {
  newComerSocketId: string;
  videoEnabledState: boolean;
  selfSocketId: string;
}

export interface InitAudioStatePayload {
  newComerSocketId: string;
  audioEnabledState: boolean;
  selfSocketId: string;
}

export interface InitSharingStatePayload {
  newComerSocketId: string;
  isShare: boolean;
  selfSocketId: string;
}

export interface InitRecordingStatePayload {
  newComerSocketId: string;
  isRecording: boolean;
  selfSocketId: string;
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

export interface ServerToClientEvents {
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
