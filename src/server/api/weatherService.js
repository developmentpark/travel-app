const URL_BASE = process.env.WEATHER_URL_BASE;
const API_KEY = process.env.WEATHER_API_KEY;

async function getWeather({ lat, lng }) {
  try {
    const url = `${URL_BASE}?lat=${lat}&lon=${lng}&appid=${API_KEY}`;

    const res = await fetch(url);
    if (res.ok) {
      const { list } = await res.json();
      const weather = list
        .filter((item) => item["dt_txt"].includes("00:00:00"))
        .map(({ main, weather, wind, dt_txt }) => ({
          date: dt_txt,
          temp: main.temp,
          pressure: main.pressure,
          humidity: main.humidity,
          icon: weather[0].icon,
          wind: wind,
        }));

      return { status: res.status, data: weather };
    }
    return { status: res.status, message: res.statusText };
  } catch (error) {
    console.log("Error: ", error.message);
    return { status: 500 };
  }
}

module.exports = { getWeather };
