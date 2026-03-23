import mongoose, { Schema } from "mongoose";
import { IAttendee } from "@shared/types/models";

const attendeesSchema = new Schema<IAttendee>({
  username: { type: String },
  isHost: { type: Boolean },
  userId: { type: String },
  roomId: { type: String },
  avatar: { type: String },
  socketId: { type: String },
});

export default mongoose.model<IAttendee>("Attendees", attendeesSchema);
