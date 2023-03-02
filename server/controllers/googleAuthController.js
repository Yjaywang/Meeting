require("dotenv").config();
const jwt = require("jsonwebtoken");

async function googleSignIn(req, res) {
  const userId = req.user._id;
  const googleId = req.user.googleId;
  const username = req.user.username;
  const avatar = req.user.avatar;
  const email = req.user.email;

  const accessToken = jwt.sign(
    { userId: userId, googleId: googleId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userId: userId, googleId: googleId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  }); //unit ms
  res.status(200).send({
    ok: true,
    accessToken: accessToken,
    data: { username: username, avatar: avatar },
  });
}

module.exports = {
  googleSignIn,
};
