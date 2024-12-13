
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADiBSizoPW4Y8NrQ6ySZLFVwZ9OrwDLwM",
  authDomain: "spectroom-fa3e9.firebaseapp.com",
  databaseURL: "https://spectroom-fa3e9-default-rtdb.firebaseio.com",
  projectId: "spectroom-fa3e9",
  storageBucket: "spectroom-fa3e9.appspot.com",
  messagingSenderId: "440568216665",
  appId: "1:440568216665:web:d54aecab70094e6edd8548",
  measurementId: "G-8Q996WGL81"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);