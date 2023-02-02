const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioController = require("../controllers/twilioController");

router.get("/get-turn-credentials", twilioController.getTURNServer);
module.exports = router;
