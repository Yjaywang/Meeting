import mongoose, { Schema } from "mongoose";
import { IRoom } from "../types/models";

const roomsSchema = new Schema<IRoom>({
  roomId: { type: String, required: true },
  isReserved: { type: Boolean, default: false },
  attendees_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendees",
    },
  ],
});

export default mongoose.model<IRoom>("Rooms", roomsSchema);
