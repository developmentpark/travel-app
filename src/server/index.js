const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const api = require("./api");

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use("/api/v0", api);

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_HOST = process.env.SERVER_HOST;
app.listen(SERVER_PORT, () =>
  console.log(`Server running on ${SERVER_HOST}:${SERVER_PORT}`),
);
