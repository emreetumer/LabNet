import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMto_l55CbaHL_CoNR91ozO8sDmNot_qM",
  authDomain: "mobil-odev-9ca70.firebaseapp.com",
  projectId: "mobil-odev-9ca70",
  storageBucket: "mobil-odev-9ca70.firebasestorage.app",
  messagingSenderId: "128145387960",
  appId: "1:128145387960:web:f65224e775c7b5c8935f4d"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firebase Authentication ve Firestore başlat
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };
