// utils/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Jouw Firebase-configuratie
const firebaseConfig = {
  apiKey: "AIzaSyBFqww7dUkB8qUJPRMZUZocL-c1UEhuDPo",
  authDomain: "disneymagicquest.firebaseapp.com",
  projectId: "disneymagicquest",
  storageBucket: "disneymagicquest.appspot.com",  // Corrected storageBucket URL
  messagingSenderId: "290470097729",
  appId: "1:290470097729:web:d2ff02fc2f60d1049767c0",
  measurementId: "G-L53LPGJDB5"
};

// Firebase initialiseren, alleen als dit nog niet is gedaan
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services initialiseren
const auth = getAuth(app);
const db = getFirestore(app);

// Functie om gebruikers in te loggen
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Exporteer de initialisaties
// Exporteer de initialisaties
export { auth, db, firebaseConfig, app };
