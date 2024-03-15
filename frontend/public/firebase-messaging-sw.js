// Filename - public/worker.js
// import axios from "axios"; 

let STATIC_CACHE_NAME = "collegeEventPWA";
let DYNAMIC_CACHE_NAME = "dynamicCollegeEventPwa";

// Add Routes and pages using React Browser Router
let urlsToCache = ["/", "/generateevent", "/login", `/eventdetails/`, '/home', "/viewstudents", "/addstudents", "/profile", "/addfaculties", "/viewfaculties", "/courses", "/eventTypes","/students","/faculties","/analytics","viewEventTypes","/addEventTypes"];

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

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Got push', data);
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: 'favicon.ico'
    });
});

// axios.interceptors.request.use((config) => {
//     // Modify config to use the service worker URL
//     config.url = '/worker' + config.url;
//     return config;
// });

