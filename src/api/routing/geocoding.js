import axios from "axios";

export default async function geocoding(params, apiKey) {
  const options = {
    method: "GET",
    url: "https://geokeo-forward-geocoding.p.rapidapi.com/search.php",
    params,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "geokeo-forward-geocoding.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {}
}
