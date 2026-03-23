require("dotenv").config();
import mongoose from "mongoose";

async function connectDB(): Promise<void> {
  const dbUrl = process.env.mongooseURL;
  if (!dbUrl) {
    throw new Error("mongooseURL environment variable is not set.");
  }
  try {
    await mongoose.connect(dbUrl, {
      maxPoolSize: 100,
    });
  } catch (error) {
    console.error("db error: ", error);
  }
}

module.exports = connectDB;
