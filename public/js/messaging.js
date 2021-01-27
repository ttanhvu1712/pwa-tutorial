messaging.onMessage((payload) => {
  console.log('onMessage', payload.notification);
  alert(payload.notification.body)
});