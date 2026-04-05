import "dotenv/config";
import User from "@shared/models/User";
import Recording from "@shared/models/Recording";
import AWS from "aws-sdk";
import awsConfig from "../configs/awsConfig";
import { updateCache } from "@shared/redis";
import { Response } from "express";
import { AuthRequest } from "../middleWares/verifyJWTMW";

const s3 = new AWS.S3(awsConfig);
const BUCKET = process.env.BUCKET;

export async function addRecording(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;
  const file = req.file!;
  const bufferData = file.buffer;
  const filename = req.file!.originalname;
  const mineType = req.body.fileType;
  const roomId = req.body.roomId;

  const uploadParams = {
    Bucket: BUCKET as string,
    Key: filename,
    Body: bufferData,
    ContentType: mineType,
  };
  try {
    s3.upload(
      uploadParams,
      async function (err: Error | null, data: AWS.S3.ManagedUpload.SendData) {
        if (err) {
          console.error("err", err);
          res
            .status(500)
            .send({ error: true, message: "upload cloud error" });
          return;
        }
        if (data) {
          const CDNURL = `${process.env.CDN_URL}${data.Key}`;

          const result = await Recording.create({
            roomId: roomId,
            recordingTime: new Date(),
            url: CDNURL,
          });
          const update = {
            $push: {
              recording_id: [result._id],
            },
          };
          const doc = await User.findByIdAndUpdate(userId, update, {
            returnOriginal: false,
          });
          updateCache(`userInfo:${userId}`, doc);

          for (const docRecordingId of doc!.recording_id) {
            if (result.url === CDNURL && docRecordingId.equals(result._id)) {
              res.status(200).send({ ok: true });
              return;
            }
          }

          res.status(400).send({ error: true, message: "update fail" });
        }
      }
    );
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}
