import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

// Types for our user profile
export interface UserProfile {
  profile: {
    name: string;
    email: string;
    walletAddress: string;
    passkeyId: string;
  };
  _base: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
  balances: {
    XLM: string;
  };
  preferredCurrency: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Export Firestore functions
export { doc, getDoc, setDoc, Timestamp };
