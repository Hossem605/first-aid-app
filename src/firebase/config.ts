// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBO2ezMFiKirSpI3FJ05dVSnniALPMqGE",
  authDomain: "first-aid-app-dfc25.firebaseapp.com",
  projectId: "first-aid-app-dfc25",
  storageBucket: "first-aid-app-dfc25.appspot.com", // corrected bucket format
  messagingSenderId: "552941563263",
  appId: "1:552941563263:web:9eb9ec626848589add7e4a",
  measurementId: "G-0C2WBHS9RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics only when supported (prevents runtime errors on localhost/incompatible envs)
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      } else {
        console.warn('[Firebase] Analytics not supported in this environment.');
      }
    })
    .catch((err) => {
      console.warn('[Firebase] Analytics initialization failed:', err);
    });
}

export { db, analytics };
export default app;