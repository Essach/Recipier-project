const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyBZFc4ja2lz3dXMawJ3PD1esNSoD4LDiIg",
  authDomain: "recipier-5fc2b.firebaseapp.com",
  projectId: "recipier-5fc2b",
  storageBucket: "recipier-5fc2b.appspot.com",
  messagingSenderId: "646285137657",
  appId: "1:646285137657:web:891628bf1e56503c33b428"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

module.exports = {firebaseConfig, storage, auth, db}
