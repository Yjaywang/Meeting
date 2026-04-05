import "dotenv/config";
import Rooms from "./Rooms";
import { IRoom, IRoomPopulated } from "../types/models";
import { HydratedDocument } from "mongoose";

export async function addRoom(
  room: Partial<IRoom>
): Promise<HydratedDocument<IRoom> | undefined> {
  try {
    const doc = await Rooms.create(room);
    return doc;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}

export async function deleteRoom(
  roomId: string
): Promise<HydratedDocument<IRoom> | null | undefined> {
  try {
    const doc = await Rooms.findOneAndDelete(
      { roomId: roomId },
      { returnOriginal: false }
    );
    return doc;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}

export async function addRoomAttendee(
  roomId: string,
  result: { _id: string }
): Promise<HydratedDocument<IRoomPopulated> | null | undefined> {
  const update = { $push: { attendees_id: [result._id] } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, update, {
      returnOriginal: false,
    })
      .populate("attendees_id")
      .exec();

    return doc as HydratedDocument<IRoomPopulated> | null;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}

export async function deleteRoomAttendee(
  roomId: string,
  attendeeId: string
): Promise<HydratedDocument<IRoomPopulated> | null | undefined> {
  const deleteObj = { $pull: { attendees_id: attendeeId } };
  try {
    const doc = await Rooms.findOneAndUpdate({ roomId: roomId }, deleteObj, {
      returnOriginal: false,
    })
      .populate("attendees_id")
      .exec();

    return doc as HydratedDocument<IRoomPopulated> | null;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}

export async function findRoom(
  roomId: string
): Promise<HydratedDocument<IRoomPopulated> | null | undefined> {
  try {
    const doc = await Rooms.findOne({ roomId: roomId })
      .populate("attendees_id")
      .exec();
    return doc as HydratedDocument<IRoomPopulated> | null;
  } catch (error) {
    console.error("db error: ", (error as Error).message);
  }
}
