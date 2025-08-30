// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC4OuBNTz4qYya9g5YaLRFF-faJsgO_ufM",
  authDomain: "values-auction-5d4e4.firebaseapp.com",
  databaseURL: "https://values-auction-5d4e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "values-auction-5d4e4",
  storageBucket: "values-auction-5d4e4.firebasestorage.app",
  messagingSenderId: "916279721792",
  appId: "1:916279721792:web:58b0c7b457c42568e304a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
