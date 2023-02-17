const express = require("express");
const router = express.Router();
const passport = require("passport");
const recordingController = require("../controllers/recordingController.js");
const verifyJWTMW = require("../middleWares/verifyJWTMW");
const multer = require("multer");
const storage = multer.memoryStorage();
const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024 * 5, // 5 MB, about 30s (max file size)
};
const upload = multer({ storage: storage, limits: limits });

//update recording url to db
router.post(
  "/",
  verifyJWTMW,
  upload.single("file"),
  recordingController.addRecording
);

module.exports = router;
