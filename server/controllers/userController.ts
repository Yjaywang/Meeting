import "dotenv/config";
import User from "../models/User";
import bcrypt from "bcrypt";
import { validateEmail, validatePassword, validateUsername } from "../utils/validate";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import awsConfig from "../configs/awsConfig";
import { updateCache, getOrSetCache } from "../redis";
import { Request, Response } from "express";
import { AuthRequest } from "../middleWares/verifyJWTMW";

const saltRounds = 10;
const s3 = new AWS.S3(awsConfig);
const BUCKET = process.env.BUCKET;

export async function signUp(req: Request, res: Response): Promise<void> {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const hash = bcrypt.hashSync(password, saltRounds);

  if (!validateEmail(email)) {
    res.status(400).send({ error: true, message: "wrong email format" });
    return;
  }
  if (!validatePassword(password)) {
    res.status(400).send({ error: true, message: "wrong password format" });
    return;
  }

  try {
    const doc = await User.findOne({ email: email });
    if (doc) {
      res.status(400).send({ error: true, message: "duplicated email" });
      return;
    }
    await User.create({ username, email, password: hash });
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const email = req.body.email;
  const password = req.body.password;
  if (!validateEmail(email)) {
    res.status(400).send({ error: true, message: "wrong email format" });
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).send({ error: true, message: "wrong password format" });
    return;
  }
  try {
    const doc = await User.findOne(
      { email: email },
      "_id password username avatar"
    );
    if (!doc) {
      res.status(400).send({ error: true, message: "login fail" });
      return;
    }
    const hashPw = doc.password;
    const userId = doc._id;
    const username = doc.username;
    const avatar = doc.avatar;

    if (bcrypt.compareSync(password, hashPw)) {
      const accessToken = jwt.sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      });
      res.status(200).send({
        ok: true,
        accessToken: accessToken,
        data: { username: username, avatar: avatar },
      });
    } else {
      res.status(400).send({ error: true, message: "login fail" });
    }
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

export async function signOut(req: Request, res: Response): Promise<void> {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(200).send({ ok: true });
    return;
  }
  if (req.session) {
    req.session.destroy(() => {});
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).send({ ok: true });
}

export async function updateUsername(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;
  const username = req.body.username;
  const update = { username: username };
  if (!username) {
    res.status(400).send({ error: true, message: "username empty" });
    return;
  }
  if (!validateUsername(username)) {
    res
      .status(400)
      .send({ error: true, message: "username larger than 8 characters" });
    return;
  }
  try {
    const doc = await User.findByIdAndUpdate(userId, update, {
      returnOriginal: false,
    });

    updateCache(`userInfo:${userId}`, doc);

    if (doc?.username) {
      res.status(200).send({ ok: true });
    }
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

export async function updatePassword(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const hash = bcrypt.hashSync(newPassword, saltRounds);
  const update = { password: hash };

  try {
    const doc1 = await User.findById(userId);
    if (!doc1) {
      res.status(404).send({ error: true, message: "User not found" });
      return;
    }
    const hashPw = doc1.password;

    if (!bcrypt.compareSync(password, hashPw)) {
      res.status(401).send({ error: true, message: "wrong password" });
      return;
    } else if (!validatePassword(newPassword)) {
      res.status(400).send({ error: true, message: "wrong password format" });
      return;
    } else if (newPassword !== confirmPassword) {
      res
        .status(400)
        .send({ error: true, message: "new password not consistent" });
      return;
    } else if (password === newPassword) {
      res
        .status(400)
        .send({ error: true, message: "same as current password" });
      return;
    } else if (bcrypt.compareSync(password, hashPw)) {
      const doc2 = await User.findByIdAndUpdate(userId, update, {
        returnOriginal: false,
      });
      updateCache(`userInfo:${userId}`, doc2);

      if (doc2?.password) {
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );
        const refreshToken = jwt.sign(
          { userId: userId },
          process.env.REFRESH_TOKEN_SECRET as string,
          { expiresIn: "7d" }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
        });
        res.status(200).send({ ok: true, accessToken: accessToken });
      }
    }
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

export async function getUserInfo(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;
  try {
    const userInfo = await getOrSetCache(`userInfo:${userId}`, async () => {
      const doc = await User.findById(userId).populate("recording_id").exec();
      return doc;
    });
    res.status(200).send({ data: userInfo });
  } catch (error) {
    console.error("db error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

export async function uploadImageToS3(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.userId;
  const imageData = req.body.imageData;
  const contentType = req.body.contentType;
  const fileExtension = contentType.split("/")[1];
  const imageBuffer = Buffer.from(imageData, "base64");
  const filename = `${uuidv4()}.${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET as string,
    Key: filename,
    Body: imageBuffer,
    ContentType: contentType,
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
          const update = { avatar: CDNURL };
          try {
            const doc = await User.findByIdAndUpdate(userId, update, {
              returnOriginal: false,
            });
            updateCache(`userInfo:${userId}`, doc);
            if (doc?.avatar === CDNURL) {
              res.status(200).send({ ok: true, data: { Url: CDNURL } });
              return;
            }
            res.status(400).send({ error: true, message: "update fail" });
          } catch (error) {
            console.error("db error: ", (error as Error).message);
            res.status(500).send({ error: true, message: "db error" });
          }
        }
      }
    );
  } catch (error) {
    console.error("S3 error: ", (error as Error).message);
    res.status(500).send({ error: true, message: "S3 error" });
  }
}
