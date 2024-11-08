// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics"; // Use `isSupported` for conditional loading
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXFkJIo3IQz0qLVbSlr2YKqetPEw18u5I",
  authDomain: "formula1diots.firebaseapp.com",
  projectId: "formula1diots",
  storageBucket: "formula1diots.appspot.com",
  messagingSenderId: "291759333922",
  appId: "1:291759333922:web:ac8b11e2dc2fedafd5207b",
  measurementId: "G-L4WLTLKXVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics variable that will be initialized only when consent is given
let analytics: Analytics | null = null;

export const initializeAnalytics = async () => {
  if (!analytics && (await isSupported())) { // Check if analytics is supported
    analytics = getAnalytics(app);
  }
  return analytics;
};

export { app, db, auth, storage };
