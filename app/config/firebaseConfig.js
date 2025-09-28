// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpVcUArtKaxHY3bKLCY54jRpwZfccWSSs",
  authDomain: "askyourcouncellor.firebaseapp.com",
  projectId: "askyourcouncellor",
  storageBucket: "askyourcouncellor.firebasestorage.app",
  messagingSenderId: "410719651175",
  appId: "1:410719651175:web:cb7b1261f686b0e0bf9bc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Use persistent auth on native via AsyncStorage; web uses default local persistence
export const auth = getAuth(app);

// Google provider for web popup sign-in
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });