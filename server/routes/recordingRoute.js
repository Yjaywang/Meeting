const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioMW = require("../middleWares/twilioMW");

//get recording
router.get("/", (req, res) => {});

//update recording url to db
router.post("/", (req, res) => {});

module.exports = router;
