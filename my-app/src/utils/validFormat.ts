export function validateEmail(email: string): boolean {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
}

//Minimum eight characters, at least one letter and one number
export function validatePassword(pw: string): boolean {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pattern.test(String(pw));
}

//This matches any string that is between 1 and 8 characters long, including whitespace characters
export function validateUsername(username: string): boolean {
  const pattern = /^.{1,8}$/;
  return pattern.test(String(username));
}

export function validateCheckPw(newPw: string, checkPw: string): boolean {
  if (newPw === checkPw) {
    return true;
  }
  return false;
}
