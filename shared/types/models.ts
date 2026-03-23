import { Types } from "mongoose";

// ---- Mongoose Document Interfaces ----

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar: string;
  googleId: string;
  recording_id: Types.ObjectId[];
}

export interface IUserPopulated extends Omit<IUser, "recording_id"> {
  recording_id: IRecording[];
}

export interface IRoom {
  _id: Types.ObjectId;
  roomId: string;
  isReserved: boolean;
  attendees_id: Types.ObjectId[];
}

export interface IRoomPopulated extends Omit<IRoom, "attendees_id"> {
  attendees_id: IAttendee[];
}

export interface IAttendee {
  _id: Types.ObjectId;
  username: string;
  isHost: boolean;
  userId: string;
  roomId: string;
  avatar: string;
  socketId: string;
}

export interface IRecording {
  _id: Types.ObjectId;
  roomId: string;
  recordingTime: Date;
  url: string;
}

// ---- Plain object versions (for Redis cache / JSON serialized) ----

export interface AttendeeData {
  username: string;
  isHost: boolean;
  userId: string;
  roomId: string;
  avatar: string;
  socketId: string;
}

export interface NewRoomData {
  roomId: string;
  attendees_id: Types.ObjectId[];
}
