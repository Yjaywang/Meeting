export async function scheduleMeeting(data) {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      window.location.href = "/signIn";
      return;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch("api/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSchedule(data) {
  try {
    const refreshResponse = await fetch("api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      window.location.href = "/signIn";
      return;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch("api/schedule", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}
