import "dotenv/config";
import express from "express";
import "./configs/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  finalErrorHandler,
  multerErrorHandler,
} from "./middleWares/errorHandlerMW";
import twilioRoute from "./routes/twilioRoute";
import userRoute from "./routes/userRoute";
import recordingRoute from "./routes/recordingRoute";
import roomRoute from "./routes/roomRoute";
import refreshRoute from "./routes/refreshRoute";
import googleAuthRoute from "./routes/googleAuthRoute";
import allowedOrigins from "./configs/allowedOrigins";

const app = express();

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));
app.use(cookieParser());

app.use("/api", twilioRoute);
app.use("/api/user", userRoute);
app.use("/api/auth/google", googleAuthRoute);
app.use("/api/recording", recordingRoute);
app.use("/api/room", roomRoute);
app.use("/api/refresh", refreshRoute);

app.use(multerErrorHandler);
app.use(finalErrorHandler);

export default app;
