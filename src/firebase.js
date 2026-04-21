import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase keys are pushed to github because the repo is private as of now. once it becomes public, revoke the keys or add firebase.js in .gitignore
const firebaseConfig = {
  apiKey: "AIzaSyDYrXlL7EiaVNghSWnf6dtnDTdO1pImfOQ",
  authDomain: "brain-exe-6a364.firebaseapp.com",
  projectId: "brain-exe-6a364",
  storageBucket: "brain-exe-6a364.firebasestorage.app",
  messagingSenderId: "478686392524",
  appId: "1:478686392524:web:607dd93d4eb4a385f51269",
  measurementId: "G-S66GNF6FV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (The Database)
export const db = getFirestore(app);

// NEW: Initialize Auth and Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();