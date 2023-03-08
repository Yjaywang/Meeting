require("dotenv").config();
const User = require("../models/User");
const Recording = require("../models/Recording");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const awsConfig = require("../configs/awsConfig");
const s3 = new AWS.S3(awsConfig);
const BUCKET = process.env.BUCKET;
const { redisClient, getOrSetCache, updateCache } = require("../redis");
const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION;

async function addRecording(req, res) {
  const userId = req.userId;
  const file = req.file;
  const bufferData = file.buffer;
  const filename = req.file.originalname;
  const mineType = req.body.fileType;
  const roomId = req.body.roomId;

  const uploadParams = {
    Bucket: BUCKET,
    Key: filename,
    Body: bufferData,
    ContentType: mineType,
  };
  try {
    s3.upload(uploadParams, async function (err, data) {
      if (err) {
        console.error("err", err);
        res.status(500).send({
          error: true,
          message: "upload cloud error",
        });
        return;
      }
      if (data) {
        const CDNURL = `${process.env.CDN_URL}${data.key}`;

        const result = await Recording.create({
          roomId: roomId,
          recordingTime: new Date(),
          url: CDNURL,
        });
        const update = {
          recording_id: result._id,
        };
        const doc = await User.findByIdAndUpdate(userId, update, {
          returnOriginal: false,
        });
        //update cache
        updateCache(`userInfo:${userId}`, doc);

        for (let docRecordingId of doc.recording_id) {
          if (result.url === CDNURL && docRecordingId === result._id) {
            res.status(200).send({ ok: true });
            return;
          }
        }

        res.status(400).send({ error: true, message: "update fail" });
      }
    });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = { addRecording };
