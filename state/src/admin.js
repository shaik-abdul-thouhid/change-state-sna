var admin = require("firebase-admin");

var serviceAccount = require("./state-change-21-firebase-adminsdk-ytnd1-e60f2a5f10.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
