const express = require("express");
const router = express.Router();

const geoNamesService = require("../geoNamesService");
const weatherService = require("../weatherService.js");
const imagesService = require("../ImagesService.js");

const projectData = [
  {
    id: 555,
    city: "Paris",
    country: "France",
    departing: Date.now(),
  },
];

router.post("/", async (req, res) => {
  const { city, departing } = req.body;
  if (!city || !departing) {
    return res.sendStatus(400);
  }

  const geoNames = await geoNamesService.getInfo(city);
  if (geoNames.status != 200) {
    return res.sendStatus(geoNames.status);
  }
  const { coordinates, country } = geoNames.data;

  const weather = await weatherService.getWeather(coordinates);
  if (weather.status != 200) {
    return res.sendStatus(weather.status);
  }
  const images = await imagesService.getImages(city);
  if (images.status != 200) {
    return res.sendStatus(images.status);
  }
  const trip = {
    id: Date.now(),
    city,
    country,
    departing,
    images: images.data,
    weather: weather.data,
  };
  projectData.push(trip);
  res.json({ status: 200, data: trip });
});

module.exports = router;
