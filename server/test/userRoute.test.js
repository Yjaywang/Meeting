const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../server");
chai.use(chaiHttp);
const should = chai.should();

describe("sign in response", () => {
  let jwtToken = "";
  it("sign in success", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;
  }).timeout(10000);

  it("wrong password format", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("wrong password format");
    jwtToken = res1.body.accessToken;
  }).timeout(10000);

  it("wrong email format", async () => {
    const user = {
      email: "test@test.c",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("wrong email format");
    jwtToken = res1.body.accessToken;
  }).timeout(10000);

  it("sign in fail, wrong password or email", async () => {
    const user = {
      email: "test@test1.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("login fail");
    jwtToken = res1.body.accessToken;
  }).timeout(10000);
});
