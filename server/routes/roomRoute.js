const express = require("express");
const router = express.Router();
const passport = require("passport");
const twilioMW = require("../middleWares/twilioMW");

router.get("/checkroom/:roomId", (req, res) => {});
module.exports = router;
