require("dotenv").config();

module.exports = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
  mailgun:{
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    from: 'Covid19 Updates <covid19@sandbox.mgsend.net>'
  }
};
