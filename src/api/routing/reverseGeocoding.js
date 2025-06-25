import axios from "axios";

export default async function reverseGeocoding(params, apiKey) {
  const options = {
    method: "GET",
    url: "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse",
    params,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response?.data
  } catch (error) {
    console.error(error);
  }
}
