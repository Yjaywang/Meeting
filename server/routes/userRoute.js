const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const verifyJWTMW = require("../middleWares/verifyJWTMW");
const multer = require("multer");
const storage = multer.memoryStorage();
const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024, // 1 MB (max file size)
};
const upload = multer({ storage: storage, limits: limits });

//sign up
router.post("/", userController.signUp);

router
  .post("/auth", userController.signIn)
  .delete("/auth", userController.signOut)
  .get("/auth", verifyJWTMW, userController.getUserInfo)
  .patch("/password", verifyJWTMW, userController.updatePassword)
  .patch("/username", verifyJWTMW, userController.updateUsername)
  .patch("/image", verifyJWTMW, userController.uploadImageToS3);

module.exports = router;
