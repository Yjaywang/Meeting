const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../server");
chai.use(chaiHttp);
const should = chai.should();
const Rooms = require("../models/Rooms");
const fs = require("fs");

describe("check twilio response", function () {
  this.timeout(10000);

  let jwtToken = "";
  it("check twilio success", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const res2 = await chai
      .request(server)
      .get("/api/get-turn-credentials")
      .set({ Authorization: `Bearer ${jwtToken}` });
    expect(res2.status).to.equal(200);
    expect(res2.body.token).to.not.equal(null);
  }).timeout(10000);

  it("jwt fail, no access token", async () => {
    const res2 = await chai.request(server).get("/api/get-turn-credentials");
    expect(res2.status).to.equal(401);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("jwt fail, no access token");
  }).timeout(10000);
});
