import express from "express";
import * as userController from "../controllers/userController";
import verifyJWTMW from "../middleWares/verifyJWTMW";

const router = express.Router();

router.post("/", userController.signUp);

router
  .post("/auth", userController.signIn)
  .delete("/auth", userController.signOut)
  .get("/auth", verifyJWTMW, userController.getUserInfo)
  .patch("/password", verifyJWTMW, userController.updatePassword)
  .patch("/username", verifyJWTMW, userController.updateUsername)
  .patch("/image", verifyJWTMW, userController.uploadImageToS3);

export default router;
