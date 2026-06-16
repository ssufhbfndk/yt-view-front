import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA0MgfF9C1K7eERFxVHkt-G4qNkYHwbspU",
  authDomain: "ythub-4089f.firebaseapp.com",
  projectId: "ythub-4089f",
  storageBucket: "ythub-4089f.firebasestorage.app",
  messagingSenderId: "869190465807",
  appId: "1:869190465807:web:062c6fe3e908e4624d667a",
  measurementId: "G-CXNDNZGSFR"
};

// SAFE INIT (important fix)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

// =========================
// REQUEST PERMISSION + TOKEN
// =========================
export const requestNotificationPermission = async () => {

  try {

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BGawA6PR7reOitBVg6dIAi9-PZNDv7ju44wDTOys0VwLVrEL9nIPu4bGKFnbGH5ylWsC0qSQPI9Y0oUoQabzD8s"
    });

    return token;

  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
};

// =========================
// FOREGROUND NOTIFICATION
// =========================
export const listenForegroundNotification = (callback) => {

  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    callback(payload);
  });

};