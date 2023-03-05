const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../server");
chai.use(chaiHttp);
const should = chai.should();

describe("test sign and get user info", () => {
  let jwtToken = "";
  it("sign in and get info", async () => {
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
      .get("/api/user/auth")
      .set({ Authorization: `Bearer ${jwtToken}` });
    expect(res2.status).to.equal(200);
    expect(res2.body.data).to.be.a("object");
  }).timeout(10000);
});
