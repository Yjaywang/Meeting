const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioMW = require("../middleWares/twilioMW");

router.get("/get-turn-credentials", twilioMW.getTURNServer);
module.exports = router;
