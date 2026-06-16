importScripts(
'https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js'
);

importScripts(
'https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: "AIzaSyA0MgfF9C1K7eERFxVHkt-G4qNkYHwbspU",
  authDomain: "ythub-4089f.firebaseapp.com",
  projectId: "ythub-4089f",
  storageBucket: "ythub-4089f.firebasestorage.app",
  messagingSenderId: "869190465807",
  appId: "1:869190465807:web:062c6fe3e908e4624d667a",
  measurementId: "G-CXNDNZGSFR"
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo192.png"
    }
  );

});