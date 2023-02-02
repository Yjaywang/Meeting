require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { validateEmail, validatePassword } = require("../utils/validate");
const jwt = require("jsonwebtoken");

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
  }
  if (!validatePassword(password)) {
    res.status(400).send({
      error: true,
      message: "wrong password format",
    });
  }
  //to DB
  try {
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
  }
  if (!validatePassword(password)) {
    res.status(400).send({
      error: true,
      message: "wrong password format",
    });
  }
  try {
    const doc = await User.findOne({ email: email }, "_id password");
    const hashPw = doc.password;
    const userId = doc._id;

    //   compare hash and password, return boolean
    if (bcrypt.compareSync(password, hashPw)) {
      //password verify ok, set access and refresh jwt token
      const accessToken = jwt.sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }); //unit ms
      res.status(200).send({ ok: true, accessToken: accessToken });
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
  }
  res.clearCookie("jwt");
  res.status(200).send({ ok: true });
}

async function getUserInfo(req, res) {
  const userId = req.userId;
  try {
    const doc = await User.findById(userId);
    res.status(200).send({ data: doc });
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = { signUp, signIn, signOut, getUserInfo };
