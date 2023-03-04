const express = require("express");
const app = express();
const cors = require("cors");
const allowedOrigins = require("./configs/allowedOrigins");

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
