require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    mongoose.connect(process.env.mongooseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 100,
    });
  } catch (error) {
    console.error("db error: ", error);
  }
}

module.exports = connectDB;
