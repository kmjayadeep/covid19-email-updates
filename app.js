const crypto = require("crypto");
const express = require("express");
const bodyParser = require("express");
const request = require("request");
const firebase = require("firebase");
const morgan = require("morgan");
const PORT = 3000;

firebase.initializeApp(require("./config"));

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

  // Add a new document in collection "cities" with ID 'LA'
  const result = await db.collection("users").doc(email).set(data);

  return res.json({
    message: "success",
    result
  });
});

app.listen(PORT, () => {
  console.log("Application listening on port", PORT);
});
