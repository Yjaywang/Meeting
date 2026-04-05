import mongoose, { Schema } from "mongoose";
import { IRecording } from "@shared/types/models";

const recordingSchema = new Schema<IRecording>({
  roomId: { type: String, default: "" },
  recordingTime: { type: Date, default: "" },
  url: { type: String, default: "" },
});

export default mongoose.model<IRecording>("Recording", recordingSchema);
