import "dotenv/config";
import app from "./app";
import http from "http";
import connectDB from "./configs/dbConfig";
import mongoose from "mongoose";

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

(server as http.Server & { maxHeaderSize: number }).maxHeaderSize = 1024 * 1024 * 5;

connectDB();

mongoose.connection.on("error", (err) => {
  console.log("db error: ", err.message);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB using Mongoose and pool");
  server.listen(PORT, () => {
    console.log(`PORT: ${PORT} listened by API server.`);
  });
});

export default server;
