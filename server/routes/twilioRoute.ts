import express from "express";
import * as twilioController from "../controllers/twilioController";
import verifyJWTMW from "../middleWares/verifyJWTMW";

const router = express.Router();

router.get(
  "/get-turn-credentials",
  verifyJWTMW,
  twilioController.getTURNServer
);

export default router;
