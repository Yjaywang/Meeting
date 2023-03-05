function validateEmail(email) {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
}

//Minimum eight characters, at least one letter and one number
function validatePassword(pw) {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pattern.test(String(pw));
}

//This matches any string that is between 1 and 8 characters long, including whitespace characters
function validateUsername(username) {
  const pattern = /^.{1,8}$/;
  return pattern.test(String(username));
}

module.exports = { validateEmail, validatePassword, validateUsername };

/* 
email:
The string must start with one of the following:
  One or more characters that are not: "<", ">", "(", ")", "[", "]", "", ".", ",", ";", ":", " ", "@", or double quotes
  A double quoted string
Followed by the "@" symbol
Followed by one of the following:
  An IP address-like string enclosed in square brackets and consisting of four 1-3 digit numbers separated by dots
  A string consisting of one or more subdomains and a domain name (minimum of 2 alphabetic characters) separated by dots
*/
