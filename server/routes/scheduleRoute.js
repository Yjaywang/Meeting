const express = require("express");
const router = express.Router();
const passport = require("passport");
const scheduleController = require("../controllers/scheduleController");
const verifyJWTMW = require("../middleWares/verifyJWTMW");

router
  .post("/", verifyJWTMW, scheduleController.addSchedule)
  .delete("/", verifyJWTMW, scheduleController.deleteSchedule);
module.exports = router;
