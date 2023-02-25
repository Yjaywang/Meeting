require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { validateEmail, validatePassword } = require("../utils/validate");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const awsConfig = require("../configs/awsConfig");
const s3 = new AWS.S3(awsConfig);
const BUCKET = process.env.BUCKET;
const { redisClient, getOrSetCache } = require("../redis");
const DEFAULT_EXPIRATION = process.env.DEFAULT_EXPIRATION;

async function signUp(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  //encode password
  const hash = bcrypt.hashSync(password, saltRounds);

  if (!validateEmail(email)) {
    res.status(400).send({
      error: true,
      message: "wrong email format",
    });
    return;
  }
  if (!validatePassword(password)) {
    res.status(400).send({
      error: true,
      message: "wrong password format",
    });
    return;
  }
  //to DB

  try {
    const doc = await User.findOne({ email: email });
    if (doc) {
      res.status(400).send({
        error: true,
        message: "duplicated email",
      });
      return;
    }
    const result = await User.create({
      username: username,
      email: email,
      password: hash,
    });
    res.status(200).send({ ok: true });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

async function signIn(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!validateEmail(email)) {
    res.status(400).send({
      error: true,
      message: "wrong email format",
    });
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).send({
      error: true,
      message: "wrong password format",
    });
    return;
  }
  try {
    const doc = await User.findOne(
      { email: email },
      "_id password username avatar"
    );
    if (!doc) {
      res.status(400).send({
        error: true,
        message: "login fail",
      });
      return;
    }
    const hashPw = doc.password;
    const userId = doc._id;
    const username = doc.username;
    const avatar = doc.avatar;

    //   compare hash and password, return boolean
    if (bcrypt.compareSync(password, hashPw)) {
      //password verify ok, set access and refresh jwt token
      const accessToken = jwt.sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }); //unit ms
      res.status(200).send({
        ok: true,
        accessToken: accessToken,
        data: { username: username, avatar: avatar },
      });
    } else {
      res.status(400).send({
        error: true,
        message: "login fail",
      });
    }
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

async function signOut(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(200).send({ ok: true });
    return;
  }
  res.clearCookie("jwt");
  res.status(200).send({ ok: true });
}

// async function updateAvatar(req, res) {

// const userId = req.userId;
// const avatar = req.body.avatar;
// const update = { avatar: avatar };
// try {
//   const doc = await User.findByIdAndUpdate(userId, update, {
//     returnOriginal: false,
//   });
//   if (doc.avatar) {
//     res.status(200).send({ ok: true });
//   }
// } catch (error) {
//   console.error("db error: ", error.message);
//   res.status(500).send({ error: true, message: "db error" });
// }
// }

async function updateUsername(req, res) {
  const userId = req.userId;
  const username = req.body.username;
  const update = { username: username };
  try {
    const doc = await User.findByIdAndUpdate(userId, update, {
      returnOriginal: false,
    });
    if (doc.username) {
      res.status(200).send({ ok: true });
    }
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

async function updatePassword(req, res) {
  const userId = req.userId;
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  //encode password
  const hash = bcrypt.hashSync(newPassword, saltRounds);
  const update = { password: hash };

  try {
    const doc1 = await User.findById(userId);
    const hashPw = doc1.password;

    if (!bcrypt.compareSync(password, hashPw)) {
      res.status(401).send({
        error: true,
        message: "wrong password",
      });
      return;
    } else if (!validatePassword(newPassword)) {
      res.status(400).send({
        error: true,
        message: "wrong password format",
      });
      return;
    } else if (newPassword !== confirmPassword) {
      res.status(400).send({
        error: true,
        message: "new password not consistent",
      });
      return;
    } else if (password === newPassword) {
      res.status(400).send({
        error: true,
        message: "same as current password",
      });
      return;
    } else if (bcrypt.compareSync(password, hashPw)) {
      //password verify ok, and new password no error
      const doc2 = await User.findByIdAndUpdate(userId, update, {
        returnOriginal: false,
      });
      if (doc2.password) {
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        const refreshToken = jwt.sign(
          { userId: userId },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "30d" }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        }); //unit ms
        res.status(200).send({ ok: true, accessToken: accessToken });
      }
    }
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

async function getUserInfo(req, res) {
  const userId = req.userId;
  try {
    const userInfo = await getOrSetCache(`userInfo:${userId}`, async () => {
      const doc = await User.findById(userId);
      return doc;
    });

    res.status(200).send({ data: userInfo });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

async function uploadImageToS3(req, res) {
  const userId = req.userId;
  const imageData = req.body.imageData;
  const contentType = req.body.contentType;
  const fileExtension = contentType.split("/")[1];
  //decode the Base64-encoded image data
  const imageBuffer = Buffer.from(imageData, "base64");
  const filename = `${uuidv4()}.${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET,
    Key: filename,
    Body: imageBuffer,
    ContentType: contentType,
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
        const update = { avatar: CDNURL };
        try {
          const doc = await User.findByIdAndUpdate(userId, update, {
            returnOriginal: false,
          });
          if (doc.avatar === CDNURL) {
            res.status(200).send({ ok: true, data: { Url: CDNURL } });
            return;
          }
          res.status(400).send({ error: true, message: "update fail" });
        } catch (error) {
          console.error("db error: ", error.message);
          res.status(500).send({ error: true, message: "db error" });
        }
      }
    });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
  getUserInfo,
  updatePassword,
  updateUsername,
  uploadImageToS3,
};
