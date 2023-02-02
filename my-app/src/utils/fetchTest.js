const testData = {
  email: "test@test.com",
  password: "123456789a",
};

async function test(testData) {
  try {
    const response = await fetch("http://localhost:5000/api/user/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testData }),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

test(testData);
