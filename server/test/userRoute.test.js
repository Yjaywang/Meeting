const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });
const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const server = require("../server");
chai.use(chaiHttp);
const should = chai.should();
const User = require("../models/User");
const fs = require("fs");

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

  it("sign in fail, wrong email", async () => {
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

  it("sign in fail, wrong password", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789aa",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("login fail");
    jwtToken = res1.body.accessToken;
  }).timeout(10000);
});

describe("sign up response", () => {
  beforeEach(async () => {
    const res = await User.findOneAndDelete({ email: "test1@test.com" });
  });

  afterEach(async () => {
    const res = await User.findOneAndDelete({ email: "test1@test.com" });
  });

  let jwtToken = "";
  it("sign up success", async () => {
    const user = {
      username: "rrrrrrrrrr",
      email: "test1@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
  }).timeout(10000);

  it("duplicated email", async () => {
    const user = {
      username: "rrrrrrrrrr",
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("duplicated email");
  }).timeout(10000);

  it("wrong password format", async () => {
    const user = {
      username: "rrrrrrrrrr",
      email: "test@test.com",
      password: "123456789",
    };
    const res1 = await chai.request(server).post("/api/user").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("wrong password format");
  }).timeout(10000);

  it("wrong email format", async () => {
    const user = {
      username: "rrrrrrrrrr",
      email: "test@test.c",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user").send(user);
    expect(res1.status).to.equal(400);
    expect(res1.body.error).to.equal(true);
    expect(res1.body.message).to.equal("wrong email format");
  }).timeout(10000);
});

describe("get user info response", () => {
  let jwtToken = "";
  it("get info success", async () => {
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
    expect(res2.body.data).to.not.equal(null);
  }).timeout(10000);

  it("jwt fail, no access token", async () => {
    const res2 = await chai.request(server).get("/api/user/auth");
    expect(res2.status).to.equal(401);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("jwt fail, no access token");
  }).timeout(10000);
});

describe("sign out response", () => {
  let jwtToken = "";
  it("sign out success", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const res2 = await chai.request(server).delete("/api/user/auth");
    expect(res2.status).to.equal(200);

    //check wjt cookie has been removed
    const res3 = await chai.request(server).get("/api/refresh");
    expect(res3.status).to.equal(401);
    expect(res3.body.error).to.equal(true);
    expect(res3.body.message).to.equal("jwt fail");
  }).timeout(10000);
});

describe("change username response", () => {
  beforeEach(async () => {
    const res = await User.findOneAndUpdate(
      { email: "test@test.com" },
      { username: "12345" }
    );
  });

  afterEach(async () => {
    const res = await User.findOneAndUpdate(
      { email: "test@test.com" },
      { username: "12345" }
    );
  });

  let jwtToken = "";
  it("change username success", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = { username: "testttt" };
    const res2 = await chai
      .request(server)
      .patch("/api/user/username")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(200);
    expect(res2.body.ok).to.equal(true);
  }).timeout(10000);

  it("empty new username", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = { username: "" };
    const res2 = await chai
      .request(server)
      .patch("/api/user/username")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(400);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("username empty");
  }).timeout(10000);

  it("new username too long", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = { username: "123456789" };
    const res2 = await chai
      .request(server)
      .patch("/api/user/username")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(400);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("username larger than 8 characters");
  }).timeout(10000);

  it("jwt fail, no access token", async () => {
    const data = { username: "testttt" };
    const res2 = await chai
      .request(server)
      .patch("/api/user/username")
      .send(data);
    expect(res2.status).to.equal(401);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("jwt fail, no access token");
  }).timeout(10000);
});

describe("change password response", () => {
  afterEach(async () => {
    const data = {
      password: "123456789aa",
      newPassword: "123456789a",
      confirmPassword: "123456789a",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
  });

  let jwtToken = "";
  it("change password success", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = {
      password: "123456789a",
      newPassword: "123456789aa",
      confirmPassword: "123456789aa",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(200);
    expect(res2.body.ok).to.equal(true);
  }).timeout(10000);

  it("wrong password format", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = {
      password: "123456789a",
      newPassword: "123456789",
      confirmPassword: "123456789",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(400);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("wrong password format");
  }).timeout(10000);

  it("new password not consistent", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = {
      password: "123456789a",
      newPassword: "123456789aa",
      confirmPassword: "123456789a",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(400);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("new password not consistent");
  }).timeout(10000);

  it("same as current password", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = {
      password: "123456789a",
      newPassword: "123456789a",
      confirmPassword: "123456789a",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(400);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("same as current password");
  }).timeout(10000);

  it("wrong password", async () => {
    const user = {
      email: "test@test.com",
      password: "123456789a",
    };
    const res1 = await chai.request(server).post("/api/user/auth").send(user);
    expect(res1.status).to.equal(200);
    expect(res1.body.ok).to.equal(true);
    expect(res1.body.data).to.be.a("object");
    jwtToken = res1.body.accessToken;

    const data = {
      password: "123456789aaa",
      newPassword: "123456789aa",
      confirmPassword: "123456789aa",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .set({ Authorization: `Bearer ${jwtToken}` })
      .send(data);
    expect(res2.status).to.equal(401);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("wrong password");
  }).timeout(10000);

  it("jwt fail, no access token", async () => {
    const data = {
      password: "123456789aaa",
      newPassword: "123456789aa",
      confirmPassword: "123456789aa",
    };
    const res2 = await chai
      .request(server)
      .patch("/api/user/password")
      .send(data);
    expect(res2.status).to.equal(401);
    expect(res2.body.error).to.equal(true);
    expect(res2.body.message).to.equal("jwt fail, no access token");
  }).timeout(10000);
});

// describe("upload avatar response", () => {
//   let jwtToken = "";
//   it("upload avatar success", async () => {
//     const user = {
//       email: "test@test.com",
//       password: "123456789a",
//     };
//     const res1 = await chai.request(server).post("/api/user/auth").send(user);
//     expect(res1.status).to.equal(200);
//     expect(res1.body.ok).to.equal(true);
//     expect(res1.body.data).to.be.a("object");
//     jwtToken = res1.body.accessToken;

//     console.log(`${__dirname}/loading.png`);
//     // const res2 = await chai
//     //   .request(server)
//     //   .patch("api/user/image")
//     //   .set({ Authorization: `Bearer ${jwtToken}` })
//     //   .set("content-type", "multipart/form-data")
//     //   .field("contentType", "image/png")
//     //   .attach(
//     //     "imageData",
//     //     fs.readFileSync(`${__dirname}/loading.png`),
//     //     "test/loading.png"
//     //   );
//     // expect(res2.status).to.equal(200);
//     // expect(res2.body.ok).to.equal(true);
//   }).timeout(10000);
// });
