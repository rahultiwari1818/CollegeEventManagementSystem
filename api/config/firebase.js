const admin = require("firebase-admin")
const serviceAccount = require("../service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();
module.exports = messaging;