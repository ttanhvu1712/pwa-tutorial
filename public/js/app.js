if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => {
      console.log("service worker registered");
      messaging.useServiceWorker(reg);
      requestPermission();
    })
    .catch((err) => console.log("service worker not registered", err));
}

const requestPermission = () => {
  messaging.requestPermission()
  .then(() => {
    console.log('Have permission')
    return messaging.getToken({vapidKey: 'BEPt3eC7wmHc2uvPPxlnYvkoMui7QKdQO8F2vhQAHHroiTIuZITBpNnkHngSLWCOL-JtJlXmS9HIL5-AHiKLSdM'});
  })
  .then((token) => {
    console.log(token)
  })
  .catch((err) => {
    console.log('Error:', err)
  })
}
