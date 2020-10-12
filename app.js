const express = require('express');
const bodyParser = require('express');
const PORT = 3000;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, ()=>{
  console.log('Application listening on port', PORT)
})
