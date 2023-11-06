import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCM4pNZWWr2--KgqkCGrbA23FhlbXc3idg",
  authDomain: "ruta-7c85f.firebaseapp.com",
  projectId: "ruta-7c85f",
  storageBucket: "ruta-7c85f.appspot.com",
  messagingSenderId: "394799816725",
  appId: "1:394799816725:web:7473c4ee94f40a9efd6e1c",
  measurementId: "G-96YP2CRVZN"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);