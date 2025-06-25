import axios from "axios";

export default async function coordsByPlaceName(params, apiKey) {
  const options = {
    method: "GET",
    url: "https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname",
    params,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "opentripmap-places-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
}
