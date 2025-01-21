self.addEventListener('push', event => {
  const data = event.data.json()
  const options = {
    body: data['text'],
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});