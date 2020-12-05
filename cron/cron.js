const config = require("./config");
const firebase = require("firebase");
const request = require("request");
const moment = require("moment");
const ejs = require("ejs");
const mailgun = require('mailgun-js');
const fs = require('fs');

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
  const date = moment().add(-1,'days').format("MMM Do, dddd");
  const template = await ejs.renderFile('./template.ejs',{ countries, date});
  // return new Promise((resolve)=>{
    // fs.writeFile('template.html', template, resolve)
  // })
  await sendMail(data.email, template, date);
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

async function fetchIndiaData(date) {
  var options = {
    method: "GET",
    url: `https://api.covid19india.org/v4/timeseries.json`,
    headers: {},
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error)
        return reject(error);
      const result = JSON.parse(response.body);
      resolve(result.TT.dates[date]);
    });
  });
}


async function fetchData(country) {
  const yesterday = moment().add(-1,'days').format("YYYY-MM-DD");
  const day2 = moment().add(-2,'days').format("YYYY-MM-DD");

  const yesterdayStats = await fetchDailyStats(country, yesterday);
  const day2Stats = await fetchDailyStats(country, day2);
  var countryData;
  const locale = 'en-IN';

  if(country == 'IN') {
    const indiaData = await fetchIndiaData(yesterday);
    countryData = {
      country,
      source: 'api.covid19india.org',
      overall:{
        cases: indiaData.total.confirmed.toLocaleString(locale),
        deaths: indiaData.total.deceased.toLocaleString(locale),
        recovered: indiaData.total.recovered.toLocaleString(locale),
        tested: indiaData.total.tested.toLocaleString(locale),
        active: (indiaData.total.confirmed - indiaData.total.recovered).toLocaleString(locale)
      },
      today:{
        cases: indiaData.delta.confirmed.toLocaleString(locale),
        deaths: indiaData.delta.deceased.toLocaleString(locale),
        recovered: indiaData.delta.recovered.toLocaleString(locale),
        tested: indiaData.delta.tested.toLocaleString(locale),
        active: (indiaData.delta.confirmed - indiaData.delta.recovered).toLocaleString(locale)
      },
    }
  }else{
    countryData = {
      country,
      source: 'covid19-api.org',
      overall: {
        cases: yesterdayStats.cases.toLocaleString(locale),
        deaths: yesterdayStats.deaths.toLocaleString(locale),
        recovered: yesterdayStats.recovered.toLocaleString(locale),
        active: (yesterdayStats.cases - yesterdayStats.recovered).toLocaleString(locale)
      },
      today: {
        cases: (yesterdayStats.cases - day2Stats.cases).toLocaleString(locale),
        deaths: (yesterdayStats.deaths - day2Stats.deaths).toLocaleString(locale),
        recovered: (yesterdayStats.recovered - day2Stats.recovered).toLocaleString(locale),
        active: (yesterdayStats.cases - yesterdayStats.recovered - day2Stats.cases + day2Stats.recovered).toLocaleString(locale)
      }
    }
  }


  return countryData;
}


async function sendMail(to, body, date) {
  const mg = mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
  const data = {
    from: config.mailgun.from,
    to,
    subject: `Covid19 Updates for ${date}`,
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

