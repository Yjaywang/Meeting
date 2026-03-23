import express from "express";
import * as roomController from "../controllers/roomController";
import verifyJWTMW from "../middleWares/verifyJWTMW";

const router = express.Router();

router.get("/:roomId", verifyJWTMW, roomController.checkRoom);

export default router;
