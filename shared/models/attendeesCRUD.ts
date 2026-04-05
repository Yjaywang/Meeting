import "dotenv/config";
import Attendees from "./Attendees";
import { IAttendee, AttendeeData } from "../types/models";
import { HydratedDocument } from "mongoose";

export async function addAttendee(
  attendee: AttendeeData
): Promise<HydratedDocument<IAttendee> | undefined> {
  try {
    const doc = await Attendees.create(attendee);
    return doc;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}

export async function deleteAttendee(
  socketId: string
): Promise<HydratedDocument<IAttendee> | null | undefined> {
  try {
    const doc = await Attendees.findOneAndDelete(
      { socketId: socketId },
      { includeResultMetadata: false }
    );
    return doc;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}

export async function findAttendee(
  socketId: string
): Promise<HydratedDocument<IAttendee> | null | undefined> {
  try {
    const doc = await Attendees.findOne({
      socketId: socketId,
    });
    return doc;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}
