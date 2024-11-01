// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };