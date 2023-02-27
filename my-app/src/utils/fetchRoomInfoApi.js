export const getRoomInfoApi = async (roomId) => {
  const url = `${process.env.REACT_APP_API_URL}/api/room/${roomId}`;
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

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`getRoomInfoApi error: ${error}`);
  }
};
