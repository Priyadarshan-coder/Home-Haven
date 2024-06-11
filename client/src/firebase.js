// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-35f08.firebaseapp.com",
  projectId: "mern-estate-35f08",
  storageBucket: "mern-estate-35f08.appspot.com",
  messagingSenderId: "430203382160",
  appId: "1:430203382160:web:0025356e6d9241ed3c2b15"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
