// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5EQtFFrxPu732CBbCX9gtkKG6FRy8uZU",
  authDomain: "e-pharmascripts.firebaseapp.com",
  projectId: "e-pharmascripts",
  storageBucket: "e-pharmascripts.appspot.com",
  messagingSenderId: "1015681631923",
  appId: "1:1015681631923:web:a77aa06c1a7be16bd812c6",
  measurementId: "G-YTL888T38X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const authentication = getAuth(app);
//firestore database
export const db = getFirestore(app);