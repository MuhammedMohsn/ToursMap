import axios from "axios";
export default async function placesListByBBox(params, apiKey) {
  const options = {
    method: "GET",
    url: `https://opentripmap-places-v1.p.rapidapi.com/en/places/bbox`,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "opentripmap-places-v1.p.rapidapi.com",
    },
    params,
  };
  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {}
}
