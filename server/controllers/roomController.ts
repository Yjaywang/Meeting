import "dotenv/config";
import * as roomsCRUD from "../models/roomsCRUD";
import { Request, Response } from "express";

export async function checkRoom(req: Request, res: Response): Promise<void> {
  const roomId = req.params.roomId as string;
  try {
    const room = await roomsCRUD.findRoom(roomId);

    if (room) {
      if (room.attendees_id.length > 10) {
        res
          .status(400)
          .send({ exist: true, join: false, message: "room is full" });
        return;
      } else {
        res
          .status(200)
          .send({ exist: true, join: true, message: "join the room" });
        return;
      }
    } else {
      res
        .status(404)
        .send({ exist: false, join: false, message: "room not exist" });
      return;
    }
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}
