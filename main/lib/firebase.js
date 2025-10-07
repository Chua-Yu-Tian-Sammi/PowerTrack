
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD04AqdmK9NJr-B_j5SwFB1fGnmBLH3E6E",
  authDomain: "powertrack-50d1f.firebaseapp.com",
  projectId: "powertrack-50d1f",
  storageBucket: "powertrack-50d1f.firebasestorage.app",
  messagingSenderId: "791748172967",
  appId: "1:791748172967:web:b8e76d5f3eeaf5790c0f82",
  measurementId: "G-WQ7RQY65E5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Only initialize analytics in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Connect to Functions emulator in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  try {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  } catch (error) {
    // Emulator might already be connected
    console.log('Functions emulator connection:', error.message);
  }
}

export default app;
