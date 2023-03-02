require("dotenv").config();
const express = require("express");
require("./configs/auth");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  finalErrorHandler,
  multerErrorHandler,
} = require("./middleWares/errorHandlerMW");
const twilioRoute = require("./routes/twilioRoute");
const userRoute = require("./routes/userRoute");
const recordingRoute = require("./routes/recordingRoute");
const roomRoute = require("./routes/roomRoute");
const refreshRoute = require("./routes/refreshRoute");
const googleAuthRoute = require("./routes/googleAuthRoute");
const allowedOrigins = require("./configs/allowedOrigins");

//add credentials:true since frontend and backend are different domain
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));
//cookie parser
app.use(cookieParser());
//use route
app.use("/api", twilioRoute);
app.use("/api/user", userRoute);
app.use("/api/auth/google", googleAuthRoute);
app.use("/api/recording", recordingRoute);
app.use("/api/room", roomRoute);
app.use("/api/refresh", refreshRoute);

//error handler
app.use(multerErrorHandler);
app.use(finalErrorHandler);

module.exports = app;
