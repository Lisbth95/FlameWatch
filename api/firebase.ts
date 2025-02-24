// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBajxgzGEvPIvqScgYyXJttsL9OrQJS-kY",
  authDomain: "flamewatch-a6440.firebaseapp.com",
  projectId: "flamewatch-a6440",
  storageBucket: "flamewatch-a6440.firebasestorage.app",
  messagingSenderId: "506971931043",
  appId: "1:506971931043:web:ad9f703ddb42d518d81a16",
  measurementId: "G-7GTXYVQDWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };