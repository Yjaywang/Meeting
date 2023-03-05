const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioController = require("../controllers/twilioController");
const verifyJWTMW = require("../middleWares/verifyJWTMW");

router.get(
  "/get-turn-credentials",
  verifyJWTMW,
  twilioController.getTURNServer
);
module.exports = router;
