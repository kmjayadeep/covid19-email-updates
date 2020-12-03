const config = require("./config");
const firebase = require("firebase");
const request = require("request");
const moment = require("moment");
const ejs = require("ejs");
const mailgun = require('mailgun-js');

firebase.initializeApp(config.firebase);

async function cron() {
  const db = firebase.firestore();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("active", "==", true).get();

  const promises = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    promises.push(processMail(data));
  });

  await Promise.all(promises);

  process.exit(0);
}

async function processMail(data) {
  console.log(data);
  const countries = [];
  for (const country of data.countries) {
    const countryData = await fetchData(country);
    countries.push(countryData);
  }
  console.log(countries)
  const template = await ejs.renderFile('./template.ejs',{ countries });
  await sendMail(data.email, template);
}

async function fetchDailyStats(country, day) {
  var options = {
    method: "GET",
    url: `https://covid19-api.org/api/status/${country}?date=${day}`,
    headers: {},
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error)
        return reject(error);
      const result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

async function fetchData(country) {
  const yesterday = moment().add(-1,'days').format("YYYY-MM-DD");
  const day2 = moment().add(-2,'days').format("YYYY-MM-DD");

  const yesterdayStats = await fetchDailyStats(country, yesterday);
  const day2Stats = await fetchDailyStats(country, day2);
  return {
    country,
    overall: yesterdayStats,
    today: {
      cases: yesterdayStats.cases - day2Stats.cases,
      deaths: yesterdayStats.deaths - day2Stats.deaths,
      recovered: yesterdayStats.recovered - day2Stats.recovered
    }
  }
}


async function sendMail(to, body) {
  const mg = mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
  const data = {
    from: config.mailgun.from,
    to,
    subject: 'Covid19 Updates',
    html: body,
  };
  return new Promise((resolve, reject)=>{
    mg.messages().send(data, function (error, body) {
      if(error){
        console.log(error)
        return reject(error)
      }
      console.log(body);
      resolve(body)
    });
  });
}


cron().catch((err) => {
  console.log(err);
  process.exit(1);
});

