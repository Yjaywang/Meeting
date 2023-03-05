const express = require("express");
const router = express.Router();
const passport = require("passport");
const roomController = require("../controllers/roomController");
const verifyJWTMW = require("../middleWares/verifyJWTMW");

router.get("/:roomId", verifyJWTMW, roomController.checkRoom);

module.exports = router;
