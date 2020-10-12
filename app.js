const express = require("express");
const bodyParser = require("express");
const request = require("request");
const PORT = 3000;

const app = express();

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

  request(options, (error, response)=> {
    if (error) return res.json({
      error
    });
    const result = JSON.parse(response.body);
    res.json(result);
  });
});

app.get("/api/register", (req, res) => {
  res.json(req.body)
});

app.listen(PORT, () => {
  console.log("Application listening on port", PORT);
});
