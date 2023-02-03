require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

///need to review
async function addSchedule(req, res) {
  const userId = req.userId;
  let schedule = req.schedule;
  schedule.userId = userId;
  const update = { $push: { schedule: [schedule] } };
  try {
    const doc = await User.findByIdAndUpdate(userId, update, {
      returnOriginal: false,
    });
    console.log(doc);
    if (doc.schedule) {
      res.status(200).send({ ok: true, data: doc.schedule });
    }
  } catch (error) {
    console.error("db error: ", error.message);
    res.status(500).send({ error: true, message: "db error" });
  }
}

module.exports = { signUp, signIn, signOut, getUserInfo };
