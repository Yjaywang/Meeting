const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioMW = require("../middleWares/twilioMW");

//get schedule
router.get("/", (req, res) => {});

//update schedule to db
router.post("/", (req, res) => {});

//delete schedule
router.post("/", (req, res) => {});
module.exports = router;
