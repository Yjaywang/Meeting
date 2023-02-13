require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleWares/errorHandlerMW");
const twilioRoute = require("./routes/twilioRoute");
const userRoute = require("./routes/userRoute");
const recordingRoute = require("./routes/recordingRoute");
const scheduleRoute = require("./routes/scheduleRoute");
const roomRoute = require("./routes/roomRoute");
const refreshRoute = require("./routes/refreshRoute");
const verifyJWTMW = require("./middleWares/verifyJWTMW");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
//cookie parser
app.use(cookieParser());
//use route
app.use("/api", twilioRoute);
app.use("/api/user", userRoute);

app.use("/api/recording", recordingRoute);
app.use("/api/room", roomRoute);
app.use("/api/refresh", refreshRoute);

//error handler
app.use(errorHandler);

//need jwt authentication
// app.use(verifyJWTMW());
app.use("/api/schedule", scheduleRoute);

module.exports = app;
