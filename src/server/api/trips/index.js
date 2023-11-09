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

router.get("/", async (req, res) => {
  res.json({ status: 200, data: projectData });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.sendStatus(400);
  }
  const tripIdx = projectData.findIndex((item) => item.id == id);
  const found = tripIdx != -1;
  if (found) {
    res.json({ status: 200, data: projectData[tripIdx] });
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.sendStatus(400);
  }
  const tripIdx = projectData.findIndex((item) => item.id == id);
  const found = tripIdx != -1;
  if (found) {
    projectData.splice(tripIdx, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

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
