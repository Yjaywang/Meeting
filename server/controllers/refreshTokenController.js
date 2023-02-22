require("dotenv").config();
const jwt = require("jsonwebtoken");

//update access token by refresh token
async function refreshHandler(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(401).send({
      error: true,
      message: "jwt fail",
    });
    return;
  }
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({
        error: true,
        message: "jwt fail",
      });
    } else {
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).send({ ok: true, accessToken: accessToken });
    }
  });
}

module.exports = { refreshHandler };
