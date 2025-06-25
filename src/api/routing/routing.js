import axios from "axios";
export default async function routing(params, apiKey) {
  const options = {
    method: "GET",
    url: "https://route-and-directions.p.rapidapi.com/v1/routing",
    params,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": 'geoapify-platform.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
}
