const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const verifyJWTMW = require("../middleWares/verifyJWTMW");

//sign up
router.post("/", userController.signUp);

router
  .post("/auth", userController.signIn)
  .delete("/auth", userController.signOut)
  .get("/auth", verifyJWTMW, userController.getUserInfo);

module.exports = router;
