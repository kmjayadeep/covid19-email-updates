const config = require('./config');
const firebase = require("firebase");

// const mailgun = require('mailgun-js');

firebase.initializeApp(config.firebase);


async function cron(){
  const db = firebase.firestore();
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where('active', '==', true).get();

  const promises = []

  snapshot.forEach(async doc => {
    const data = doc.data() 
    promises.push(await processMail(data));
  });

  await Promise.all(promises);

  process.exit(0)
}

async function processMail(data){
  console.log(data)
}


cron().catch(err=>{
  console.log(err)
  process.exit(1)
})



// const mg = mailgun({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
// const data = {
	// from: config.mailgun.from,
	// to: 'kmjayadeep@gmail.com',
	// subject: 'works again',
	// text: 'works'
// };
// mg.messages().send(data, function (error, body) {
  // if(error){
    // console.log(error)
  // }
	// console.log(body);
// });
