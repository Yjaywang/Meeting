export const getTwilioDataApi = async () => {
  const url = `http://localhost:5000/api/get-turn-credentials`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`getTwilioDataApi error: ${error}`);
  }
};
