async function postData(data) {
  try {
    const response = await fetch("http://localhost:5000/api/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error(error);
  }
}

const data = { email: "test@test.com", password: "123456789a" };
postData(data);
