const assert = require("assert");
const validate = require("../utils/validate");

describe("validateTest", () => {
  describe("validEmail", () => {
    it("the email should be valid", () => {
      const email = "test@test.com";
      const result = validate.validateEmail(email);
      assert.equal(result, true);
    });
    it("the email should be invalid", () => {
      const email = "test@test.c";
      const result = validate.validateEmail(email);
      assert.equal(result, false);
    });
    it("the email should be invalid", () => {
      const email = "test.test.com";
      const result = validate.validateEmail(email);
      assert.equal(result, false);
    });
  });
  describe("validPassword", () => {
    it("the password should be valid", () => {
      const password = "123456789a";
      const result = validate.validatePassword(password);
      assert.equal(result, true);
    });
    it("the password should be invalid", () => {
      const password = "123456789";
      const result = validate.validatePassword(password);
      assert.equal(result, false);
    });
    it("the password should be invalid", () => {
      const password = "aaaaaaaa";
      const result = validate.validatePassword(password);
      assert.equal(result, false);
    });
    it("the password should be invalid", () => {
      const password = "123456a";
      const result = validate.validatePassword(password);
      assert.equal(result, false);
    });
  });
});
