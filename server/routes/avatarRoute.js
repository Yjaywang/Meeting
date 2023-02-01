const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioMW = require("../middleWares/twilioMW");

//update avatar url to DB
router.patch("/", (req, res) => {});

module.exports = router;
