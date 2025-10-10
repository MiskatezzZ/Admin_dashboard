// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8Uz3rayJVU9VLv85NEjVQMkzQ-DdbsAE",
  authDomain: "collector-a92a1.firebaseapp.com",
  projectId: "collector-a92a1",
  storageBucket: "collector-a92a1.firebasestorage.app",
  messagingSenderId: "374482240997",
  appId: "1:374482240997:web:dea3e59207d8511790db0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Use persistent auth on native via AsyncStorage; web uses default local persistence
export const auth = getAuth(app);

// Google provider for web popup sign-in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });