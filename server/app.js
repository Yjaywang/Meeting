const express = require("express");
const cors = require("cors");
require("dotenv").config();
const twilioRoute = require("./routes/twilioRoute");
const userRoute = require("./routes/userRoute");
const avatarRoute = require("./routes/avatarRoute");
const recordingRoute = require("./routes/recordingRoute");
const scheduleRoute = require("./routes/scheduleRoute");
const roomRoute = require("./routes/roomRoute");

const app = express();
app.use(cors());

//use route
app.use("/api", twilioRoute);
app.use("/api/user", userRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/recording", recordingRoute);
app.use("/api/avatar", avatarRoute);
// app.use("/api", roomRoute);

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
