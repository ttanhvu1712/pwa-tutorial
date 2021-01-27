importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-analytics.js");

var config = {
  apiKey: "AIzaSyDCIkxXR2WisVJ1WDPEp-2N_vjwsRjE1ug",
  authDomain: "pwa-tutorial-3514d.firebaseapp.com",
  databaseURL: "https://pwa-tutorial-3514d-default-rtdb.firebaseio.com",
  projectId: "pwa-tutorial-3514d",
  storageBucket: "pwa-tutorial-3514d.appspot.com",
  messagingSenderId: "104179144635",
  appId: "1:104179144635:web:0aefc614709f4f6f77569e",
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/messaging.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js",
  "https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js",
  "https://www.gstatic.com/firebasejs/8.2.4/firebase-analytics.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
  "https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/pages/fallback.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  console.log("service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener("fetch", (evt) => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        }
      })
    );
  }
});

// push notification
// self.addEventListener('push', (event) => {
//   console.log(event)
// });

messaging.onBackgroundMessage((payload) => {
  console.log("onBackgroundMessage", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./img/icon-72x72.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
