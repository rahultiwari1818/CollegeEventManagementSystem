import {initializeApp} from 'firebase/app';
import { getToken,onMessage } from "firebase/messaging";
import { getMessaging } from "firebase/messaging/sw";

import { toast } from 'react-toastify';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain:process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};


export const firebaseApp = initializeApp(config);
export const messaging = getMessaging(firebaseApp);



export const onMessageListener = () =>{
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    toast.info(payload);
  });
  
}