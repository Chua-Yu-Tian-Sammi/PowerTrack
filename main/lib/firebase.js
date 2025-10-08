
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
    const emulatorHost = import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || "127.0.0.1";
    const emulatorPort = parseInt(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT) || 5001;
    connectFunctionsEmulator(functions, emulatorHost, emulatorPort);
  } catch (error) {
    // Emulator might already be connected
    console.log('Functions emulator connection:', error.message);
  }
}

export default app;
