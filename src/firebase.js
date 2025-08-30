// Import Firebase core
import { initializeApp } from "firebase/app";
// Import Firestore
import { getFirestore } from "firebase/firestore";

// Konfigurasi dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC4OuBNTz4qYya9g5YaLRFF-faJsgO_ufM",
  authDomain: "values-auction-5d4e4.firebaseapp.com",
  databaseURL: "https://values-auction-5d4e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "values-auction-5d4e4",
  storageBucket: "values-auction-5d4e4.firebasestorage.app",
  messagingSenderId: "916279721792",
  appId: "1:916279721792:web:58b0c7b457c42568e304a5",
  measurementId: "G-PQMZKVJRVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore supaya bisa dipakai di App.js
export const db = getFirestore(app);
