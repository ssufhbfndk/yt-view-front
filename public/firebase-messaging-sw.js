importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Firebase config (same as above)
firebase.initializeApp({
  apiKey: "AIzaSyA0MgfF9C1K7eERFxVHkt-G4qNkYHwbspU",
  authDomain: "ythub-4089f.firebaseapp.com",
  projectId: "ythub-4089f",
  storageBucket: "ythub-4089f.firebasestorage.app",
  messagingSenderId: "869190465807",
  appId: "1:869190465807:web:062c6fe3e908e4624d667a"
});

const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage(function (payload) {

  console.log("Background message received:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});