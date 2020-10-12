require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
};
