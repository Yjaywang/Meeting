import express from "express";
import * as recordingController from "../controllers/recordingController";
import verifyJWTMW from "../middleWares/verifyJWTMW";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const limits = {
  files: 1,
  fileSize: 1024 * 1024 * 5, // 5 MB
};
const upload = multer({ storage, limits });

router.post(
  "/",
  verifyJWTMW,
  upload.single("file"),
  recordingController.addRecording
);

export default router;
