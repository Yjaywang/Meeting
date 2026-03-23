// Client-side model types (no Mongoose dependency)

export interface IAttendee {
  _id?: string;
  username: string;
  isHost: boolean;
  userId: string;
  roomId: string;
  avatar: string;
  socketId: string;
}

export interface IRecording {
  _id: string;
  roomId: string;
  recordingTime: string;
  url: string;
}
