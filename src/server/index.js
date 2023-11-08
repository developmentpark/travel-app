const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(morgan("combined"));
app.use(cors());

app.get("/", (req, res) => res.json({ message: "Hello World" }));

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_HOST = process.env.SERVER_HOST;
app.listen(SERVER_PORT, () =>
  console.log(`Server running on ${SERVER_HOST}:${SERVER_PORT}`),
);
