export async function googleSignIn() {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/google`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();
    console.log("ereeeeeee", responseData);
    return responseData;
  } catch (error) {
    console.error(error);
  }
}
