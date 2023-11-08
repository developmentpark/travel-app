const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const weatherService = require("./weatherService.js");
const imagesService = require("./ImagesService.js");

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.sendStatus(400);
  }
  const weather = await weatherService.getWeather(city);
  res.json(weather);
});

app.get("/images", async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.sendStatus(400);
  }
  const images = await imagesService.getImages(keyword);
  res.json(images);
});

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_HOST = process.env.SERVER_HOST;
app.listen(SERVER_PORT, () =>
  console.log(`Server running on ${SERVER_HOST}:${SERVER_PORT}`),
);
