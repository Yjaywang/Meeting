const express = require("express");
const router = express.Router();
const passport = require("passport");
const roomController = require("../controllers/roomController");

router.get("/:roomId", roomController.checkRoom);

module.exports = router;
