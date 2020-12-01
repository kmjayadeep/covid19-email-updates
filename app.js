const express = require("express");
const bodyParser = require("express");
const request = require("request");
const firebase = require("firebase");
const morgan = require("morgan");
const path = require('path')
const cors = require('cors')

const config = require('./config');

const PORT = config.port;

firebase.initializeApp(config.firebase);

const app = express();
app.use(morgan("dev"));
app.use(cors());

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
    res.json(result.map(r=>({
      value: r.alpha2,
      label: r.name, 
    })));
  });
});

app.post("/api/register", async (req, res) => {
  const { email, countries, includeGlobal } = req.body;
  const db = firebase.firestore();

  const data = {
    email,
    countries,
    includeGlobal,
    active: true
  };

  await db.collection("users").doc(email).set(data);

  return res.json({
    message: "success",
  });
});


app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (_,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log("Application listening on port", PORT);
});
