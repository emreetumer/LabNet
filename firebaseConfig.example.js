// LabNet Firebase Configuration Template
// 📋 KURULUM: Bu dosyayı "firebaseConfig.js" olarak kopyalayın ve kendi Firebase bilgilerinizi girin
// 
// 1. Firebase Console'a gidin: https://console.firebase.google.com/
// 2. Projenizi oluşturun veya seçin
// 3. Project Settings > General > Your apps > Web app ekleyin
// 4. Firebase config bilgilerini buraya yapıştırın

import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    browserLocalPersistence,
    setPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ UYARI: Bu değerleri kendi Firebase projenizin değerleriyle değiştirin!
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with browser persistence
const auth = getAuth(app);

// Set persistence for web
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Auth persistence error:", error);
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };
