import mongoose, { Schema } from "mongoose";
import { IUser } from "@shared/types/models";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, default: "" },
  avatar: { type: String, default: "" },
  googleId: { type: String, default: "" },
  recording_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recording",
    },
  ],
});

export default mongoose.model<IUser>("User", userSchema);
