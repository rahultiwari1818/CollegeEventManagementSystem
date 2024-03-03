import firebase from 'firebase/app';
import 'firebase/messaging';

const config = {
  apiKey: "API-KEY",
  authDomain: "AUTH-DOMAIN",
  databaseURL: "DATABASE-URL",
  projectId: "PROJECT-ID",
  storageBucket: "STORAGE-BUCKET",
  messagingSenderId: "MESSAGING-SENDER-ID",
  appId: "APP-ID"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();
