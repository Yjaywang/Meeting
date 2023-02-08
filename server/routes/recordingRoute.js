const express = require("express");
const router = express.Router();
const passport = require("passport");
const recordingController = require("../controllers/recordingController.js");
const verifyJWTMW = require("../middleWares/verifyJWTMW");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//update recording url to db
router.post(
  "/",
  verifyJWTMW,
  upload.single("file"),
  recordingController.addRecording
);

module.exports = router;
