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

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
//cookie parser
app.use(cookieParser());
//use route
app.use("/api", twilioRoute);
app.use("/api/user", userRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/recording", recordingRoute);
// app.use("/api", roomRoute);
app.use("/api/refresh", refreshRoute);

//error handler
app.use(errorHandler);
///////////////////////////////////////////////////////////////////////////////////////////////
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
module.exports = app;
