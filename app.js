const crypto = require('crypto');
const express = require("express");
const bodyParser = require("express");
const request = require("request");
const firebase = require("firebase");
const morgan = require("morgan");
const PORT = 3000;

firebase.initializeApp(require('./config'));

const app = express();
app.use(morgan('dev'))

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

app.get("/api/register", (req, res) => {
  const { email, countries } = req.body;
  const database = firebase.database();

  const shasum = crypto.createHash('sha1')
  shasum.update(email)
  const mailhash = shasum.digest('hex')


  database.ref("users/"+mailhash).set({
    email,
    countries,
    active: true
  });
  return res.json({
    message: "success",
  });
});

app.listen(PORT, () => {
  console.log("Application listening on port", PORT);
});
