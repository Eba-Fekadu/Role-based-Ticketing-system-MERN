// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-project-34d7b.firebaseapp.com",
  projectId: "blog-project-34d7b",
  storageBucket: "blog-project-34d7b.appspot.com",
  messagingSenderId: "49609157396",
  appId: "1:49609157396:web:fe609f7799f4cb0c347001"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

