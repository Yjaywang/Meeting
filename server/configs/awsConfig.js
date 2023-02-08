require("dotenv").config();

const config = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};

module.exports = config;
