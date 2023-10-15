self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});
  
self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});
  
self.addEventListener("push", function (e) {
  if (!e.data.json()) return;
  const result = e.data.json();
  const notificationTitle = result.data.content;
  console.log(notificationTitle)
  self.registration.showNotification(notificationTitle); // alert 제목을 보여줌
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  const url = "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});