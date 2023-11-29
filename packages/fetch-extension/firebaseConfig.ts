import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdK3MbMjH5oAkHCPQ7fIpajcPHUJP503k",
  authDomain: "wallet-2fa-poc.firebaseapp.com",
  projectId: "wallet-2fa-poc",
  storageBucket: "wallet-2fa-poc.appspot.com",
  messagingSenderId: "77820851704",
  appId: "1:77820851704:web:c9d489fcf270c8244b120d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreApp = getFirestore(app);
