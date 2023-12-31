const URL_BASE = process.env.GEONAMES_URL_BASE;
const API_KEY = process.env.GEONAMES_API_KEY;

async function getInfo(city) {
  const url = `${URL_BASE}?username=${API_KEY}&type=json&name=${city}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { status: res.status, message: res.statusText };
    }
    const data = await res.json();
    if (data.totalResultsCount && data.totalResultsCount > 0) {
      const { lat, lng, countryName } = data.geonames[0];
      return {
        status: 200,
        data: { coordinates: { lat, lng }, country: countryName },
      };
    }
    return { status: 404 };
  } catch (error) {
    console.log("Error: ", error.message);
    return { status: 500 };
  }
}

module.exports = { getInfo };
