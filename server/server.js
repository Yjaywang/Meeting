require("dotenv").config();
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const connectDB = require("./configs/dbConfig");
const mongoose = require("mongoose");
const { redisClient, getOrSetCache } = require("./redis");

//allow upload max 5 MB file
server.maxHeaderSize = 1024 * 1024 * 5;

//connect DB
connectDB();

mongoose.connection.on("error", (err) => {
  console.log("db error: ", err.message);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB using Mongoose and pool");
  server.listen(PORT, () => {
    console.log(`PORT: ${PORT} listened by server.`);
  });
});

module.exports = server;
