import express from "express";
import * as refreshTokenController from "../controllers/refreshTokenController";

const router = express.Router();

router.get("/", refreshTokenController.refreshHandler);

export default router;
