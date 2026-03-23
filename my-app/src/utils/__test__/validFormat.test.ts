import * as validFormat from "../validFormat";

test("email validation", () => {
  const email1 = "test@test.com";
  const email2 = "test@test.c";
  const email3 = "test.test.c";
  expect(validFormat.validateEmail(email1)).toBe(true);
  expect(validFormat.validateEmail(email2)).toBe(false);
  expect(validFormat.validateEmail(email3)).toBe(false);
});

test("password validation", () => {
  const pw1 = "123456789a";
  const pw2 = "123456a";
  const pw3 = "123456789";
  expect(validFormat.validatePassword(pw1)).toBe(true);
  expect(validFormat.validatePassword(pw2)).toBe(false);
  expect(validFormat.validatePassword(pw3)).toBe(false);
});

test("username length", () => {
  const user1 = "12345678";
  const user2 = "";
  const user3 = "123456789";
  expect(validFormat.validateUsername(user1)).toBe(true);
  expect(validFormat.validateUsername(user2)).toBe(false);
  expect(validFormat.validateUsername(user3)).toBe(false);
});

test("password consistent check", () => {
  const newPw1 = "123456789a";
  const checkPw1 = "123456789a";
  const checkPw2 = "123456789";
  expect(validFormat.validateCheckPw(newPw1, checkPw1)).toBe(true);
  expect(validFormat.validateCheckPw(newPw1, checkPw2)).toBe(false);
});
