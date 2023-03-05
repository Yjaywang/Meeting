require("dotenv").config();
const { server, io } = require("./socketIOServer");
const PORT = process.env.PORT || 8000;
const connectDB = require("./configs/dbConfig");
const mongoose = require("mongoose");
const { redisClient, getOrSetCache } = require("./redis");

//connect DB
connectDB();

mongoose.connection.on("error", (err) => {
  console.log("db error: ", err.message);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB using Mongoose and pool");
  server.listen(PORT, () => {
    console.log(`PORT: ${PORT} listened by websocket server.`);
  });
});

module.exports = server;
