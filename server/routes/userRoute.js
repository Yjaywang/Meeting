const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWTMW = require("../middleWares/verifyJWTMW");

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
