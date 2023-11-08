const geoNamesService = require("./geoNamesService");

const URL_BASE = process.env.WEATHER_URL_BASE;
const API_KEY = process.env.WEATHER_API_KEY;

async function getWeather(city) {
  try {
    const data = await geoNamesService.getCoordinates(city);
    if (data.status != 200) {
      return data;
    }
    const { lat, lng } = data.coordinates;
    const url = `${URL_BASE}?lat=${lat}&lon=${lng}&appid=${API_KEY}`;

    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      return { status: res.status, ...json };
    }
    return { status: res.status, message: res.statusText };
  } catch (error) {
    console.log("Error: ", error.message);
    return { status: 500 };
  }
}

module.exports = { getWeather };
