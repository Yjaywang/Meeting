function validateEmail(email: string): boolean {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email.toLowerCase());
}

//Minimum eight characters, at least one letter and one number
function validatePassword(pw: string): boolean {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pattern.test(pw);
}

//This matches any string that is between 1 and 8 characters long, including whitespace characters
function validateUsername(username: string): boolean {
  const pattern = /^.{1,8}$/;
  return pattern.test(username);
}

module.exports = { validateEmail, validatePassword, validateUsername };
