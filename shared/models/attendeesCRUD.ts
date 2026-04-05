import "dotenv/config";
import Attendees from "./Attendees";
import { IAttendee, AttendeeData } from "../types/models";
import { HydratedDocument } from "mongoose";

export async function addAttendee(
  attendee: AttendeeData
): Promise<HydratedDocument<IAttendee>> {
  const doc = await Attendees.create(attendee);
  return doc;
}

export async function deleteAttendee(
  socketId: string
): Promise<HydratedDocument<IAttendee> | null> {
  const doc = await Attendees.findOneAndDelete(
    { socketId: socketId },
    { includeResultMetadata: false }
  );
  return doc;
}

export async function findAttendee(
  socketId: string
): Promise<HydratedDocument<IAttendee> | null> {
  const doc = await Attendees.findOne({
    socketId: socketId,
  });
  return doc;
}
