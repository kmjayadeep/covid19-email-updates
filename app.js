const express = require("express");
const bodyParser = require("express");
const request = require("request");
const firebase = require("firebase");
const morgan = require("morgan");

const config = require('./config');

const PORT = config.port;

firebase.initializeApp(config.firebase);

const app = express();
app.use(morgan("dev"));

app.use(bodyParser.json());

app.get("/api", (_, res) => {
  res.json({
    message: "Covid Daily Updates V1.0.0",
  });
});

app.get("/api/country", (_, res) => {
  var options = {
    method: "GET",
    url: "https://covid19-api.org/api/countries",
    headers: {},
  };

  request(options, (error, response) => {
    if (error)
      return res.json({
        error,
      });
    const result = JSON.parse(response.body);
    res.json(result);
  });
});

app.get("/api/register", async (req, res) => {
  const { email, countries } = req.body;
  const db = firebase.firestore();

  const data = {
    email,
    countries,
    active: true
  };

  await db.collection("users").doc(email).set(data);

  return res.json({
    message: "success",
  });
});

app.listen(PORT, () => {
  console.log("Application listening on port", PORT);
});
