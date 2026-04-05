import "dotenv/config";
import User from "@shared/models/User";
import Recording from "@shared/models/Recording";
import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "../configs/awsConfig";
import { updateCache } from "@shared/redis";
import { Response } from "express";
import { AuthRequest } from "../middleWares/verifyJWTMW";

const BUCKET = process.env.BUCKET;

export async function addRecording(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;
  const file = req.file!;
  const bufferData = file.buffer;
  const filename = file.originalname;
  const mimeType = req.body.fileType;
  const roomId = req.body.roomId;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET as string,
        Key: filename,
        Body: bufferData,
        ContentType: mimeType,
      },
    });
    await upload.done();

    const CDNURL = `${process.env.CDN_URL}${filename}`;

    const result = await Recording.create({
      roomId: roomId,
      recordingTime: new Date(),
      url: CDNURL,
    });

    const doc = await User.findByIdAndUpdate(
      userId,
      { $push: { recording_id: [result._id] } },
      { returnOriginal: false }
    );
    updateCache(`userInfo:${userId}`, doc);

    res.status(200).send({ ok: true });
  } catch (error) {
    console.error("upload/db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "failed to add recording" });
  }
}
