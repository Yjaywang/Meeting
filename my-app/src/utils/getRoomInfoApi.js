export const getRoomInfoApi = async (roomId) => {
  const url = `http://localhost:5000/api/checkroom/${roomId}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`getRoomInfoApi error: ${error}`);
  }
};