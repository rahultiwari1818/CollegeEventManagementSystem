// Filename - public/worker.js
// import axios from "axios"; 

let STATIC_CACHE_NAME = "collegeEventPWA";
let DYNAMIC_CACHE_NAME = "dynamicCollegeEventPwa";
 
// Add Routes and pages using React Browser Router
let urlsToCache = ["/", "/generateevent", "/login",`/eventdetails/`,'/home',"/viewstudents","/addstudents","/profile","/addfaculties","/viewfaculties","/courses","/eventTypes"];
 
// Install a service worker
self.addEventListener("install", (event) => {
    // Perform install steps
    event.waitUntil(
        caches
            .open(STATIC_CACHE_NAME)
            .then(function (cache) {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
    );
});
 
// Cache and return requests

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cacheRes) => {
            return (
                cacheRes ||
                fetch(event.request).then((fetchRes) => {
                    return caches
                        .open(DYNAMIC_CACHE_NAME)
                        .then((cache) => {
                            cache.put(
                                event.request.url,
                                fetchRes.clone()
                            );
                            return fetchRes;
                        });
                })
            );
        })
    );


    if (!navigator.onLine) {
        if (
            event.request.url.includes("/static/js/bundle.js")
        ) {

            event.waitUntil(
                self.registration.showNotification(
                    "Internet",
                    {
                        body: "internet not working",
                        icon: "logo192.png",
                    }
                )
            );
        }
    }
});
 
// Update a service worker
self.addEventListener("activate", (event) => {
    let cacheWhitelist = ["collegeEventPWA"];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheWhitelist.indexOf(
                            cacheName
                        ) === -1
                    ) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// axios.interceptors.request.use((config) => {
//     // Modify config to use the service worker URL
//     config.url = '/worker' + config.url;
//     return config;
// });

importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

const config = {
    apiKey: "AIzaSyCx0QsNveOsWYhDVkGacumJKrtPBt4-46M",
    authDomain: "collegeeventmanagementsy-7b38e.firebaseapp.com",
    projectId: "collegeeventmanagementsy-7b38e",
    storageBucket: "collegeeventmanagementsy-7b38e.appspot.com",
    messagingSenderId: "491208788781",
    appId: "1:491208788781:web:56a5e07805905594a2a1a4",
    measurementId: "G-4CSQL5V76S"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/firebase-logo.png'
  };
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});
