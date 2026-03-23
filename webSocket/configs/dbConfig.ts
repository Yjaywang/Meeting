require("dotenv").config();
import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.mongooseURL as string, {
      maxPoolSize: 100,
    });
  } catch (error) {
    console.error("db error: ", error);
  }
}

module.exports = connectDB;
