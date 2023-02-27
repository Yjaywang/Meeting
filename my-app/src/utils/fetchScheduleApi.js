export async function scheduleMeeting(data) {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSchedule(data) {
  try {
    const refreshResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/api/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const refreshResponseData = await refreshResponse.json();
    if (refreshResponseData.error) {
      return refreshResponseData;
    }
    const accessToken = refreshResponseData.accessToken;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/schedule`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
  }
}
