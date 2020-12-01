require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
  mailgun:{
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    from: process.env.MAILGUN_FROM
  }
};
