import axios from "axios";

export default async function citiesNearLocation(params, apiKey, latlng) {
  let { lat, lng } = latlng;
  const options = {
    method: "GET",
    url: `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${lat}${
      lng > 0 ? `+${lng}` : lng
    }/nearbyCities`,
    params,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {}
}
