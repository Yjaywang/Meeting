const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioMW = require("../middleWares/twilioMW");

//sign up
router.post("/", (req, res) => {});

//sign in
router.post("/auth", (req, res) => {});

//log out
router.delete("/auth", (req, res) => {});

//get member info
router.get("/auth", (req, res) => {});

module.exports = router;
