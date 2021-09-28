const firebase = require('firebase-admin');
const config = require('./config');

var serviceAccount = require("./tutorx-platform-firebase-adminsdk-889xc-b95d44c342.json");

const db = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://tutorx-platform-default-rtdb.firebaseio.com"
});
module.exports = db;