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

describe("check room response", function () {
  this.timeout(10000);
  const data = {
    roomId: "xxx-xxx-xxx",
  };
  beforeEach(async () => {
    const doc = await Rooms.create(data);
  });
  afterEach(async () => {
    const doc = await Rooms.findOneAndDelete(data);
  });

  let jwtToken = "";
  it("check room success", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const roomId = "xxx-xxx-xxx";
    const res2 = await chai
      .request(server)
      .get(`/api/room/${roomId}`)
      .set({ Authorization: `Bearer ${jwtToken}` });
    expect(res2.status).to.equal(200);
    expect(res2.body.exist).to.equal(true);
    expect(res2.body.join).to.equal(true);
    expect(res2.body.message).to.equal("join the room");
  }).timeout(10000);

  it("jwt fail, no access token", async () => {
    const roomId = "xxx-xxx-xxx";
    const res2 = await chai.request(server).get(`/api/room/${roomId}`);
    expect(res2.status).to.equal(401);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("jwt fail, no access token");
  }).timeout(10000);
});
