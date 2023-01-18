export const getRoomInfo = async (roomId) => {
  const url = `http://localhost:5000/api/checkroom/${roomId}`;
  const response = await fetch(url);
  return response.data;
};
