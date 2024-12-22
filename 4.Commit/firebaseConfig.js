// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMto_l55CbaHL_CoNR91ozO8sDmNot_qM",
  authDomain: "mobil-odev-9ca70.firebaseapp.com",
  projectId: "mobil-odev-9ca70",
  storageBucket: "mobil-odev-9ca70.firebasestorage.app",
  messagingSenderId: "128145387960",
  appId: "1:128145387960:web:f65224e775c7b5c8935f4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
