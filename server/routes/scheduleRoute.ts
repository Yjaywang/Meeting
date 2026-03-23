import express from "express";
// Note: scheduleController does not exist yet - this route was pre-existing but non-functional
// import * as scheduleController from "../controllers/scheduleController";
// import verifyJWTMW from "../middleWares/verifyJWTMW";

const router = express.Router();

// router
//   .post("/", verifyJWTMW, scheduleController.addSchedule)
//   .delete("/", verifyJWTMW, scheduleController.deleteSchedule);

export default router;
