import "dotenv/config";
import { server } from "./socketIOServer";
import connectDB from "@shared/configs/dbConfig";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;

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

export default server;
