require("dotenv").config();
const twilio = require("twilio");
const Api = require("twilio/lib/rest/Api");

function getTURNServer(req, res) {
  const twilioAccountSid = process.env["twilioAccountSid"];
  const twilioAuthToken = process.env["twilioAuthToken"];
  const client = twilio(twilioAccountSid, twilioAuthToken);

  try {
    client.tokens.create().then((token) => {
      return res.send({ token }).status(200);
    });
  } catch (error) {
    console.log("twilio error: ", error);
    return res.send({ token: null }).status(403);
  }
}

module.exports = { getTURNServer };
