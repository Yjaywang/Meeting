const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");

router.get("/", refreshTokenController.refreshHandler);

module.exports = router;
