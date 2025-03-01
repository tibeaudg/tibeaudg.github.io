// utils/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFqww7dUkB8qUJPRMZUZocL-c1UEhuDPo",
  authDomain: "disneymagicquest.firebaseapp.com",
  projectId: "disneymagicquest",
  storageBucket: "disneymagicquest.firebasestorage.app",
  messagingSenderId: "290470097729",
  appId: "1:290470097729:web:d2ff02fc2f60d1049767c0",
  measurementId: "G-L53LPGJDB5"

};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Function to login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export { auth, db };
