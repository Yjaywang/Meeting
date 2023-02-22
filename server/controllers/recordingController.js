require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const awsConfig = require("../configs/awsConfig");
const s3 = new AWS.S3(awsConfig);
const BUCKET = process.env.BUCKET;

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
        const CDNURL = `https://d26qu93gsa16ou.cloudfront.net/${data.key}`;
        const update = {
          $push: {
            recording: [
              {
                roomId: roomId,
                recordingTime: new Date(),
                url: CDNURL,
              },
            ],
          },
        };
        const doc = await User.findByIdAndUpdate(userId, update, {
          returnOriginal: false,
        });

        for (let docRecording of doc.recording) {
          if (docRecording.url === CDNURL) {
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
