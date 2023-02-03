const express = require("express");
const router = express.Router();
const passport = require("passport");
const recordingController = require("../controllers/recordingController.js");
const verifyJWTMW = require("../middleWares/verifyJWTMW");

//update recording url to db
router.post("/", verifyJWTMW, recordingController.addRecording);

module.exports = router;
