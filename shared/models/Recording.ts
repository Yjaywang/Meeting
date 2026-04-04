import mongoose, { Schema } from "mongoose";
import { IRecording } from "../types/models";

const recordingSchema = new Schema<IRecording>({
  roomId: { type: String, default: "" },
  recordingTime: { type: Date },
  url: { type: String, default: "" },
});

export default mongoose.model<IRecording>("Recording", recordingSchema);
